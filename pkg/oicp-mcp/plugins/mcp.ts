import {McpServer} from "@modelcontextprotocol/sdk/server/mcp.js";
import {StreamableHTTPServerTransport} from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import {FastifyInstance, FastifyPluginOptions} from "fastify";
import {fastifyPlugin as fp} from "fastify-plugin";
import {OICPParser} from "../lib/oicp-parser";
import {ResourceHandler} from "../lib/resource-handlers";
import {
  ToolHandler,
  SearchOperationsArgsSchema,
  GetOperationDetailsArgsSchema,
  GetDataSchemaArgsSchema,
  ListServicesArgsSchema,
  SearchSchemasArgsSchema,
  GetOperationsByTagArgsSchema,
} from "../lib/tool-handlers";

async function mcpPlugin(
  fastify: FastifyInstance,
  opts: FastifyPluginOptions & {appPath: string},
): Promise<void> {
  const appPath = opts.appPath || process.cwd();

  // Initialize parser and handlers
  fastify.log.info("Initializing OICP parser...");
  const parser = new OICPParser(appPath);
  await parser.initialize();
  fastify.log.info("OICP parser initialized successfully");

  const resourceHandler = new ResourceHandler(appPath, parser);
  const toolHandler = new ToolHandler(parser);

  // Create MCP server with handlers
  const mcp = new McpServer(
    {
      name: "oicp-mcp",
      version: "1.0.0",
      description: "OICP v2.3 MCP Server for Hubject Integration (CPO and EMP)",
    },
    {capabilities: {resources: {}, tools: {}}},
  );

  // Register resources - list all available resources
  const resources = await resourceHandler.listResources();
  for (const res of resources) {
    mcp.resource(
      res.name,
      res.uri,
      {description: res.description, mimeType: res.mimeType},
      async () => {
        fastify.log.debug({uri: res.uri}, "Reading resource");
        const resource = await resourceHandler.getResource(res.uri);
        return {contents: [{uri: res.uri, mimeType: resource.mimeType, text: resource.contents}]};
      },
    );
  }

  // Register tools

  mcp.registerTool(
    "search_oicp_operations",
    {
      title: "Search for OICP operations/endpoints",
      description:
        "Search for OICP operations/endpoints by keyword. Searches in operation names, descriptions, paths, and tags.",
      inputSchema: SearchOperationsArgsSchema.shape,
    },
    async (args) => {
      fastify.log.debug({args}, "Searching operations");
      const validated = SearchOperationsArgsSchema.parse(args);
      const result = toolHandler.searchOperations(validated);
      return {content: [{type: "text", text: result}]};
    },
  );

  mcp.tool(
    "get_operation_details",
    "Get detailed information about a specific OICP operation including parameters, request body, and responses.",
    GetOperationDetailsArgsSchema.shape,
    async (args) => {
      fastify.log.debug({args}, "Getting operation details");
      const validated = GetOperationDetailsArgsSchema.parse(args);
      const result = toolHandler.getOperationDetails(validated);
      return {content: [{type: "text", text: result}]};
    },
  );

  mcp.tool(
    "get_data_schema",
    "Retrieve a specific data type/schema definition from the OICP specification.",
    GetDataSchemaArgsSchema.shape,
    async (args) => {
      fastify.log.debug({args}, "Getting data schema");
      const validated = GetDataSchemaArgsSchema.parse(args);
      const result = toolHandler.getDataSchema(validated);
      return {content: [{type: "text", text: result}]};
    },
  );

  mcp.tool(
    "list_services",
    "List all available services (tags) for a specific role (CPO or EMP).",
    ListServicesArgsSchema.shape,
    async (args) => {
      fastify.log.debug({args}, "Listing services");
      const validated = ListServicesArgsSchema.parse(args);
      const result = toolHandler.listServices(validated);
      return {content: [{type: "text", text: result}]};
    },
  );

  mcp.tool(
    "search_schemas",
    "Search for data schemas/types by keyword in schema names or descriptions.",
    SearchSchemasArgsSchema.shape,
    async (args) => {
      fastify.log.debug({args}, "Searching schemas");
      const validated = SearchSchemasArgsSchema.parse(args);
      const result = toolHandler.searchSchemas(validated);
      return {content: [{type: "text", text: result}]};
    },
  );

  mcp.tool(
    "get_operations_by_tag",
    "Get all operations that belong to a specific service tag (e.g., eRoamingAuthorization).",
    GetOperationsByTagArgsSchema.shape,
    async (args) => {
      fastify.log.debug({args}, "Getting operations by tag");
      const validated = GetOperationsByTagArgsSchema.parse(args);
      const result = toolHandler.getOperationsByTag(validated);
      return {content: [{type: "text", text: result}]};
    },
  );

  // Register Fastify route for MCP
  fastify.route({
    url: "/mcp",
    method: "POST",
    handler: async function mcpHandler(req, reply) {
      try {
        fastify.log.debug("MCP handler called");
        reply.hijack();
        const transport = new StreamableHTTPServerTransport({
          sessionIdGenerator: undefined,
          enableJsonResponse: true,
        });

        reply.raw.on("close", () => {
          fastify.log.debug("MCP connection closed");
          transport.close();
        });

        await mcp.connect(transport);
        await transport.handleRequest(req.raw, reply.raw, req.body);
      } catch (error) {
        console.error("Error handling MCP request:", error);
        if (!reply.raw.headersSent) {
          reply
            .status(500)
            .send({
              jsonrpc: "2.0",
              error: {code: -32603, message: "Internal server error"},
              id: null,
            });
        }
      }
    },
  });

  fastify.log.info("OICP MCP plugin registered successfully");
}

// Export without fastify-plugin wrapper to respect prefix
export default mcpPlugin;
