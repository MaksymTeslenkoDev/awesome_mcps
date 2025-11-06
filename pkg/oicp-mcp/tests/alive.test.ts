import assert from "node:assert/strict";
import {afterEach, beforeEach, describe, test} from "node:test";

import {FastifyInstance} from "fastify";

import {build} from "./helper";

let app: FastifyInstance;
describe("Alive", () => {
  beforeEach(async () => {
    app = await build();
  });
  afterEach(async () => {
    await app.close();
  });

  test("should be alive", async () => {
    const response = await app.inject({method: "POST", url: "/oicp/v2.3/ping"});
    assert.strictEqual(response.statusCode, 200);
    assert.strictEqual(response.body, "pong");
  });
});
