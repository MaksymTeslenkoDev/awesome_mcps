import {McpServer} from "@modelcontextprotocol/sdk/server/mcp.js";
import {StreamableHTTPServerTransport} from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import {FastifyInstance, FastifyPluginOptions} from "fastify";
import {fastifyPlugin as fp} from "fastify-plugin";

async function mcpPlugin(fastify: FastifyInstance, opts: FastifyPluginOptions): Promise<void> {
  const mcp = new McpServer({
    name: "oicp-mcp",
    version: "1.0.0",
    description: "OICP MCP server",
    capabilities: {services: []},
  });

  fastify.route({
    url: "/mcp",
    method: "POST",
    handler: async function mcpHandler(req, reply) {
      const transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: undefined,
        enableJsonResponse: true,
      });
      mcp.connect(transport);
      await transport.handleRequest(req.raw, reply.raw, req.body);
    },
  });
}

export default fp(mcpPlugin, {name: "mcp-server-plugin", fastify: "5.x"});
