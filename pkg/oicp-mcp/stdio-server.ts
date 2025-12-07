import {McpServer} from "@modelcontextprotocol/sdk/server/mcp.js";
import {StdioServerTransport} from "@modelcontextprotocol/sdk/server/stdio.js";
import {OICPParser} from "./lib/oicp-parser.js";
import {ResourceHandler} from "./lib/resource-handlers.js";
import {
  ToolHandler,
  SearchOperationsArgsSchema,
  GetOperationDetailsArgsSchema,
  GetDataSchemaArgsSchema,
  ListServicesArgsSchema,
  SearchSchemasArgsSchema,
  GetOperationsByTagArgsSchema,
} from "./lib/tool-handlers.js";

async function main() {
  const appPath = process.cwd();
  console.error("Starting OICP MCP Server (stdio mode)...");
  console.error("App path:", appPath);

  // Initialize parser and handlers
  console.error("Initializing OICP parser...");
  const parser = new OICPParser(appPath);
  await parser.initialize();
  console.error("OICP parser initialized successfully");

  const resourceHandler = new ResourceHandler(appPath, parser);
  const toolHandler = new ToolHandler(parser);

  // Create MCP server
  const mcp = new McpServer(
    {
      name: "oicp-mcp",
      version: "1.0.0",
      description: "OICP v2.3 MCP Server for Hubject Integration (CPO and EMP)",
    },
    {capabilities: {resources: {}, tools: {}}},
  );

  // Register resources
  const resources = await resourceHandler.listResources();
  console.error(`Registering ${resources.length} resources...`);
  for (const res of resources) {
    mcp.resource(
      res.name,
      res.uri,
      {description: res.description, mimeType: res.mimeType},
      async () => {
        const resource = await resourceHandler.getResource(res.uri);
        return {contents: [{uri: res.uri, mimeType: resource.mimeType, text: resource.contents}]};
      },
    );
  }

  // Register tools
  console.error("Registering tools...");

  mcp.registerTool(
    "search_oicp_operations",
    {
      title: "Search for OICP operations/endpoints",
      description:
        "Search for OICP operations/endpoints by keyword. Searches in operation names, descriptions, paths, and tags.",
      inputSchema: SearchOperationsArgsSchema.shape,
    },
    async (args) => {
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
      const validated = GetOperationsByTagArgsSchema.parse(args);
      const result = toolHandler.getOperationsByTag(validated);
      return {content: [{type: "text", text: result}]};
    },
  );

  // Connect via stdio
  console.error("Connecting MCP server via stdio...");
  const transport = new StdioServerTransport();
  await mcp.connect(transport);
  console.error("OICP MCP Server ready!");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
