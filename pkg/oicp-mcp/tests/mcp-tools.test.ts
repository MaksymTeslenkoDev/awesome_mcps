/**
 * Tests for MCP Tool Handlers
 */

import {describe, it, before} from "node:test";
import assert from "node:assert";
import {OICPParser} from "../lib/oicp-parser";
import {ToolHandler} from "../lib/tool-handlers";
import {join} from "path";

describe("MCP Tool Handlers", () => {
  let parser: OICPParser;
  let toolHandler: ToolHandler;
  const appPath = join(process.cwd());

  before(async () => {
    parser = new OICPParser(appPath);
    await parser.initialize();
    toolHandler = new ToolHandler(parser);
  });

  describe("searchOperations", () => {
    it("should search operations by keyword", () => {
      const result = toolHandler.searchOperations({keyword: "authorize"});
      const parsed = JSON.parse(result);
      assert.ok(parsed.success, "Should be successful");
      assert.ok(parsed.results.length > 0, "Should find operations");
    });

    it("should filter operations by role", () => {
      const result = toolHandler.searchOperations({keyword: "authorize", role: "cpo"});
      const parsed = JSON.parse(result);
      assert.ok(parsed.success, "Should be successful");
      assert.ok(
        parsed.results.every((r: any) => r.role === "CPO"),
        "All results should be CPO",
      );
    });

    it("should return empty results for non-existent keyword", () => {
      const result = toolHandler.searchOperations({keyword: "nonexistentkeyword12345"});
      const parsed = JSON.parse(result);
      assert.ok(parsed.success, "Should be successful");
      assert.strictEqual(parsed.results.length, 0, "Should have no results");
    });

    it("should return structured operation data", () => {
      const result = toolHandler.searchOperations({keyword: "authorize"});
      const parsed = JSON.parse(result);
      if (parsed.results.length > 0) {
        const firstResult = parsed.results[0];
        assert.ok(firstResult.role, "Should have role");
        assert.ok(firstResult.operationId, "Should have operationId");
        assert.ok(firstResult.method, "Should have method");
        assert.ok(firstResult.path, "Should have path");
        assert.ok(firstResult.summary !== undefined, "Should have summary");
        assert.ok(Array.isArray(firstResult.tags), "Should have tags array");
      }
    });
  });

  describe("getOperationDetails", () => {
    it("should get operation details by ID", () => {
      const operations = parser.getAllOperations("cpo");
      const firstOp = operations[0];
      const result = toolHandler.getOperationDetails({operationId: firstOp.operationId});
      const parsed = JSON.parse(result);
      assert.ok(parsed.success, "Should be successful");
      assert.ok(parsed.operation, "Should have operation details");
      assert.strictEqual(parsed.operation.operationId, firstOp.operationId);
    });

    it("should return error for non-existent operation", () => {
      const result = toolHandler.getOperationDetails({operationId: "nonexistent_op"});
      const parsed = JSON.parse(result);
      assert.strictEqual(parsed.success, false, "Should not be successful");
    });

    it("should include detailed operation information", () => {
      const operations = parser.getAllOperations("cpo");
      const firstOp = operations[0];
      const result = toolHandler.getOperationDetails({operationId: firstOp.operationId});
      const parsed = JSON.parse(result);
      const op = parsed.operation;
      assert.ok(op.role, "Should have role");
      assert.ok(op.operationId, "Should have operationId");
      assert.ok(op.method, "Should have method");
      assert.ok(op.path, "Should have path");
      assert.ok(op.tags !== undefined, "Should have tags");
      assert.ok(op.responses !== undefined, "Should have responses");
    });
  });

  describe("getDataSchema", () => {
    it("should get schema by name", () => {
      const index = parser.getIndex();
      const schemaNames = Object.keys(index.cpo.schemas);
      if (schemaNames.length > 0) {
        const result = toolHandler.getDataSchema({schemaName: schemaNames[0], role: "cpo"});
        const parsed = JSON.parse(result);
        assert.ok(parsed.success, "Should be successful");
        assert.ok(parsed.schema, "Should have schema");
        assert.strictEqual(parsed.schemaName, schemaNames[0]);
      }
    });

    it("should return error for non-existent schema", () => {
      const result = toolHandler.getDataSchema({schemaName: "NonExistentSchema", role: "cpo"});
      const parsed = JSON.parse(result);
      assert.strictEqual(parsed.success, false, "Should not be successful");
    });
  });

  describe("listServices", () => {
    it("should list CPO services", () => {
      const result = toolHandler.listServices({role: "cpo"});
      const parsed = JSON.parse(result);
      assert.ok(parsed.success, "Should be successful");
      assert.strictEqual(parsed.role, "CPO", "Should be CPO");
      assert.ok(parsed.services.length > 0, "Should have services");
    });

    it("should list EMP services", () => {
      const result = toolHandler.listServices({role: "emp"});
      const parsed = JSON.parse(result);
      assert.ok(parsed.success, "Should be successful");
      assert.strictEqual(parsed.role, "EMP", "Should be EMP");
      assert.ok(parsed.services.length > 0, "Should have services");
    });

    it("should include service metadata", () => {
      const result = toolHandler.listServices({role: "cpo"});
      const parsed = JSON.parse(result);
      if (parsed.services.length > 0) {
        const firstService = parsed.services[0];
        assert.ok(firstService.name, "Service should have name");
        assert.ok(firstService.description !== undefined, "Service should have description");
      }
    });
  });

  describe("searchSchemas", () => {
    it("should search schemas by keyword", () => {
      const result = toolHandler.searchSchemas({keyword: "status"});
      const parsed = JSON.parse(result);
      assert.ok(parsed.success, "Should be successful");
      // May or may not have results depending on schema names
    });

    it("should filter schemas by role", () => {
      const result = toolHandler.searchSchemas({keyword: "e", role: "cpo"});
      const parsed = JSON.parse(result);
      assert.ok(parsed.success, "Should be successful");
      if (parsed.results.length > 0) {
        assert.ok(
          parsed.results.every((r: any) => r.role === "CPO"),
          "All results should be CPO",
        );
      }
    });

    it("should return structured schema data", () => {
      const result = toolHandler.searchSchemas({keyword: "e"});
      const parsed = JSON.parse(result);
      if (parsed.results.length > 0) {
        const firstResult = parsed.results[0];
        assert.ok(firstResult.role, "Should have role");
        assert.ok(firstResult.name, "Should have name");
        assert.ok(firstResult.type !== undefined, "Should have type");
        assert.ok(firstResult.description !== undefined, "Should have description");
      }
    });
  });

  describe("getOperationsByTag", () => {
    it("should get operations by tag", () => {
      const tags = parser.getTags("cpo");
      if (tags.length > 0) {
        const result = toolHandler.getOperationsByTag({tag: tags[0]});
        const parsed = JSON.parse(result);
        assert.ok(parsed.success, "Should be successful");
        assert.ok(parsed.results.length > 0, "Should have operations");
      }
    });

    it("should filter by role", () => {
      const tags = parser.getTags("cpo");
      if (tags.length > 0) {
        const result = toolHandler.getOperationsByTag({tag: tags[0], role: "cpo"});
        const parsed = JSON.parse(result);
        assert.ok(parsed.success, "Should be successful");
        if (parsed.results.length > 0) {
          assert.ok(
            parsed.results.every((r: any) => r.role === "CPO"),
            "All results should be CPO",
          );
        }
      }
    });

    it("should return empty results for non-existent tag", () => {
      const result = toolHandler.getOperationsByTag({tag: "NonExistentTag"});
      const parsed = JSON.parse(result);
      assert.ok(parsed.success, "Should be successful");
      assert.strictEqual(parsed.results.length, 0, "Should have no results");
    });
  });

  describe("JSON response format", () => {
    it("should always return valid JSON", () => {
      const operations = [
        () => toolHandler.searchOperations({keyword: "test"}),
        () => toolHandler.listServices({role: "cpo"}),
        () => toolHandler.searchSchemas({keyword: "test"}),
      ];

      operations.forEach((operation) => {
        const result = operation();
        assert.doesNotThrow(() => {
          JSON.parse(result);
        }, "Should return valid JSON");
      });
    });

    it("should include success field in all responses", () => {
      const operations = [
        toolHandler.searchOperations({keyword: "test"}),
        toolHandler.listServices({role: "cpo"}),
        toolHandler.searchSchemas({keyword: "test"}),
      ];

      operations.forEach((result) => {
        const parsed = JSON.parse(result);
        assert.ok("success" in parsed, "Should have success field");
        assert.strictEqual(typeof parsed.success, "boolean", "Success should be boolean");
      });
    });

    it("should include message field in all responses", () => {
      const operations = [
        toolHandler.searchOperations({keyword: "test"}),
        toolHandler.listServices({role: "cpo"}),
        toolHandler.searchSchemas({keyword: "test"}),
      ];

      operations.forEach((result) => {
        const parsed = JSON.parse(result);
        assert.ok("message" in parsed, "Should have message field");
        assert.strictEqual(typeof parsed.message, "string", "Message should be string");
      });
    });
  });
});
