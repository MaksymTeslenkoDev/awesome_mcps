import path from "node:path";
import {join} from "node:path";

import {FastifyInstance} from "fastify";
import helper from "fastify-cli/helper";

import {AppConfig} from "../config";
import configLoader from "../config.loader";
import serverConfig from "../config/server-options";

const AppPath = path.join(__dirname, "..", "app.ts");

async function build(configApp?: Partial<AppConfig>) {
  const appPath = join(__dirname, "..");
  const rootTestConfig = configLoader({appPath: __dirname});
  const appConfig = configApp ? {...rootTestConfig, ...configApp} : rootTestConfig;
  const argv = ["-l info", AppPath, "--options"];

  const app = (await helper.build(
    argv,
    {config: appConfig, appPath},
    serverConfig(appConfig),
  )) as FastifyInstance;
  return app as FastifyInstance;
}

export {build};
