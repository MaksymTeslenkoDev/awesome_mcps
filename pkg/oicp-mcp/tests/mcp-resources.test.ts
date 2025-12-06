/**
 * Tests for MCP Resource Handlers
 */

import {describe, it, before} from "node:test";
import assert from "node:assert";
import {OICPParser} from "../lib/oicp-parser";
import {ResourceHandler, parseResourceURI} from "../lib/resource-handlers";
import {join} from "path";

describe("MCP Resource Handlers", () => {
  let parser: OICPParser;
  let resourceHandler: ResourceHandler;
  const appPath = join(process.cwd());

  before(async () => {
    parser = new OICPParser(appPath);
    await parser.initialize();
    resourceHandler = new ResourceHandler(appPath, parser);
  });

  describe("parseResourceURI", () => {
    it("should parse CPO openapi URI", () => {
      const result = parseResourceURI("oicp://cpo/openapi");
      assert.ok(result);
      assert.strictEqual(result.role, "cpo");
      assert.strictEqual(result.type, "openapi");
    });

    it("should parse EMP documentation URI", () => {
      const result = parseResourceURI("oicp://emp/documentation");
      assert.ok(result);
      assert.strictEqual(result.role, "emp");
      assert.strictEqual(result.type, "documentation");
    });

    it("should parse image URI with filename", () => {
      const result = parseResourceURI("oicp://cpo/images/hubject_1.png");
      assert.ok(result);
      assert.strictEqual(result.role, "cpo");
      assert.strictEqual(result.type, "images");
      assert.strictEqual(result.imageName, "hubject_1.png");
    });

    it("should return null for invalid URI", () => {
      const result = parseResourceURI("invalid://uri");
      assert.strictEqual(result, null);
    });
  });

  describe("listResources", () => {
    it("should list all available resources", async () => {
      const resources = await resourceHandler.listResources();
      assert.ok(resources.length > 0, "Should have resources");
      assert.ok(
        resources.some((r) => r.uri === "oicp://cpo/openapi"),
        "Should include CPO OpenAPI",
      );
      assert.ok(
        resources.some((r) => r.uri === "oicp://emp/openapi"),
        "Should include EMP OpenAPI",
      );
      assert.ok(
        resources.some((r) => r.uri === "oicp://cpo/documentation"),
        "Should include CPO documentation",
      );
      assert.ok(
        resources.some((r) => r.uri === "oicp://emp/documentation"),
        "Should include EMP documentation",
      );
    });

    it("should include image resources", async () => {
      const resources = await resourceHandler.listResources();
      const imageResources = resources.filter((r) => r.uri.includes("/images/"));
      assert.ok(imageResources.length > 0, "Should have image resources");
    });

    it("should have correct metadata for resources", async () => {
      const resources = await resourceHandler.listResources();
      resources.forEach((resource) => {
        assert.ok(resource.uri, "Resource should have URI");
        assert.ok(resource.name, "Resource should have name");
        assert.ok(resource.description, "Resource should have description");
        assert.ok(resource.mimeType, "Resource should have mimeType");
      });
    });
  });

  describe("getResource", () => {
    it("should get CPO OpenAPI spec", async () => {
      const resource = await resourceHandler.getResource("oicp://cpo/openapi");
      assert.ok(resource.contents, "Should have contents");
      assert.strictEqual(resource.mimeType, "application/x-yaml");
      assert.ok(resource.contents.includes("openapi:"), "Should be OpenAPI YAML");
    });

    it("should get EMP OpenAPI spec", async () => {
      const resource = await resourceHandler.getResource("oicp://emp/openapi");
      assert.ok(resource.contents, "Should have contents");
      assert.strictEqual(resource.mimeType, "application/x-yaml");
      assert.ok(resource.contents.includes("openapi:"), "Should be OpenAPI YAML");
    });

    it("should get CPO documentation", async () => {
      const resource = await resourceHandler.getResource("oicp://cpo/documentation");
      assert.ok(resource.contents, "Should have contents");
      assert.strictEqual(resource.mimeType, "text/html");
      assert.ok(
        resource.contents.includes("<html") || resource.contents.includes("<!DOCTYPE"),
        "Should be HTML",
      );
    });

    it("should get EMP documentation", async () => {
      const resource = await resourceHandler.getResource("oicp://emp/documentation");
      assert.ok(resource.contents, "Should have contents");
      assert.strictEqual(resource.mimeType, "text/html");
      assert.ok(
        resource.contents.includes("<html") || resource.contents.includes("<!DOCTYPE"),
        "Should be HTML",
      );
    });

    it("should throw error for invalid URI", async () => {
      await assert.rejects(
        async () => {
          await resourceHandler.getResource("invalid://uri");
        },
        {message: /Invalid resource URI/},
        "Should throw error for invalid URI",
      );
    });

    it("should throw error for missing image name", async () => {
      await assert.rejects(
        async () => {
          await resourceHandler.getResource("oicp://cpo/images");
        },
        {message: /Image name required for images resource/},
        "Should throw error for missing image name",
      );
    });
  });

  describe("MIME types", () => {
    it("should return correct MIME type for YAML", async () => {
      const resource = await resourceHandler.getResource("oicp://cpo/openapi");
      assert.strictEqual(resource.mimeType, "application/x-yaml");
    });

    it("should return correct MIME type for HTML", async () => {
      const resource = await resourceHandler.getResource("oicp://cpo/documentation");
      assert.strictEqual(resource.mimeType, "text/html");
    });
  });
});
