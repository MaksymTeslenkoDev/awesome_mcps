/**
 * Tests for OICP Parser
 */

import {describe, it, before} from "node:test";
import assert from "node:assert";
import {OICPParser} from "../lib/oicp-parser";
import {join} from "path";

describe("OICPParser", () => {
  let parser: OICPParser;
  const appPath = join(process.cwd());

  before(async () => {
    parser = new OICPParser(appPath);
    await parser.initialize();
  });

  describe("initialization", () => {
    it("should initialize successfully", () => {
      assert.ok(parser, "Parser should be initialized");
    });

    it("should load CPO document", () => {
      const cpoDoc = parser.getDocument("cpo");
      assert.ok(cpoDoc, "CPO document should be loaded");
      assert.strictEqual(cpoDoc.info.title, "CPO OICP-2.3");
      assert.strictEqual(cpoDoc.info.version, "2.3.0");
    });

    it("should load EMP document", () => {
      const empDoc = parser.getDocument("emp");
      assert.ok(empDoc, "EMP document should be loaded");
      assert.strictEqual(empDoc.info.title, "EMP OICP-2.3");
      assert.strictEqual(empDoc.info.version, "2.3.0");
    });
  });

  describe("operation parsing", () => {
    it("should parse CPO operations", () => {
      const operations = parser.getAllOperations("cpo");
      assert.ok(operations.length > 0, "Should have CPO operations");
      assert.ok(
        operations.every((op) => op.role === "cpo"),
        "All operations should be for CPO role",
      );
    });

    it("should parse EMP operations", () => {
      const operations = parser.getAllOperations("emp");
      assert.ok(operations.length > 0, "Should have EMP operations");
      assert.ok(
        operations.every((op) => op.role === "emp"),
        "All operations should be for EMP role",
      );
    });

    it("should include operation metadata", () => {
      const operations = parser.getAllOperations("cpo");
      const firstOp = operations[0];
      assert.ok(firstOp.path, "Operation should have path");
      assert.ok(firstOp.method, "Operation should have method");
      assert.ok(firstOp.operationId, "Operation should have operationId");
    });
  });

  describe("search operations", () => {
    it("should search operations by keyword", () => {
      const results = parser.searchOperations("authorize");
      assert.ok(results.length > 0, 'Should find operations with "authorize"');
    });

    it("should search operations by role", () => {
      const results = parser.searchOperations("authorize", "cpo");
      assert.ok(results.length > 0, 'Should find CPO operations with "authorize"');
      assert.ok(
        results.every((op) => op.role === "cpo"),
        "All results should be CPO operations",
      );
    });

    it("should return empty array for non-existent keyword", () => {
      const results = parser.searchOperations("nonexistentkeyword12345");
      assert.strictEqual(results.length, 0, "Should return empty array");
    });
  });

  describe("get operation by id", () => {
    it("should get operation by exact ID", () => {
      const operations = parser.getAllOperations("cpo");
      const firstOp = operations[0];
      const found = parser.getOperationById(firstOp.operationId);
      assert.ok(found, "Should find operation");
      assert.strictEqual(found.operationId, firstOp.operationId);
    });

    it("should return null for non-existent ID", () => {
      const found = parser.getOperationById("nonexistent_operation_id");
      assert.strictEqual(found, null, "Should return null for non-existent ID");
    });
  });

  describe("get operations by tag", () => {
    it("should get operations by tag", () => {
      const tags = parser.getTags("cpo");
      if (tags.length > 0) {
        const operations = parser.getOperationsByTag(tags[0]);
        assert.ok(operations.length > 0, "Should find operations for tag");
        assert.ok(
          operations.every((op) => op.tags.includes(tags[0])),
          "All operations should have the tag",
        );
      }
    });
  });

  describe("schemas", () => {
    it("should get schemas for CPO", () => {
      const index = parser.getIndex();
      const schemaNames = Object.keys(index.cpo.schemas);
      assert.ok(schemaNames.length > 0, "Should have CPO schemas");
    });

    it("should get schemas for EMP", () => {
      const index = parser.getIndex();
      const schemaNames = Object.keys(index.emp.schemas);
      assert.ok(schemaNames.length > 0, "Should have EMP schemas");
    });

    it("should search schemas by keyword", () => {
      const results = parser.searchSchemas("status");
      const resultKeys = Object.keys(results);
      assert.ok(resultKeys.length > 0, 'Should find schemas with "status"');
    });
  });

  describe("services", () => {
    it("should get services for CPO", () => {
      const services = parser.getServices("cpo");
      assert.ok(services.length > 0, "Should have CPO services");
      assert.ok(
        services.every((s) => s.name),
        "All services should have names",
      );
    });

    it("should get services for EMP", () => {
      const services = parser.getServices("emp");
      assert.ok(services.length > 0, "Should have EMP services");
      assert.ok(
        services.every((s) => s.name),
        "All services should have names",
      );
    });
  });

  describe("tags", () => {
    it("should get tags for CPO", () => {
      const tags = parser.getTags("cpo");
      assert.ok(tags.length > 0, "Should have CPO tags");
    });

    it("should get tags for EMP", () => {
      const tags = parser.getTags("emp");
      assert.ok(tags.length > 0, "Should have EMP tags");
    });
  });
});
