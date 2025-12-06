import {FastifyPluginAsync} from "fastify";

import {AppConfig} from "./config";
import root from "./routes/root";
import mcpPlugin from "./plugins/mcp";

const app: FastifyPluginAsync<{config: AppConfig; appPath: string}> = async (
  fastify,
  opts,
): Promise<void> => {
  // Register MCP plugin
  fastify.register(mcpPlugin, {appPath: opts.appPath, prefix: "/oicp/v2.3/"});

  // Register root routes
  fastify.register(root, {prefix: "/oicp/v2.3/"});
};

export default app;
