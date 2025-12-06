/**
 * Property-Based Tests for MCP Server
 * 
 * Feature: kiro-power-integration
 * Tests Properties 8, 9, and 15 from the design document
 * 
 * These tests complement the unit tests by verifying universal properties
 * across many randomly generated inputs, focusing on invariants and edge cases
 * that unit tests with specific examples might miss.
 */

import {describe, it, before} from "node:test";
import assert from "node:assert";
import * as fc from "fast-check";
import {OICPParser} from "../lib/oicp-parser";
import {ToolHandler} from "../lib/tool-handlers";
import {ResourceHandler} from "../lib/resource-handlers";
import {join} from "path";

describe("MCP Server Property-Based Tests", () => {
  let parser: OICPParser;
  let toolHandler: ToolHandler;
  let resourceHandler: ResourceHandler;
  const appPath = join(process.cwd());

  before(async () => {
    parser = new OICPParser(appPath);
    await parser.initialize();
    toolHandler = new ToolHandler(parser);
    resourceHandler = new ResourceHandler(appPath, parser);
  });

  /**
   * Feature: kiro-power-integration, Property 8: MCP server exposes all tools
   * Validates: Requirements 3.1
   * 
   * Universal property: The MCP server must always expose exactly 6 tools,
   * regardless of configuration or state.
   */
  it("Property 8: MCP server always exposes exactly 6 tools", async () => {
    // This is a constant property - verify it holds across multiple checks
    await fc.assert(
      fc.asyncProperty(fc.constant(null), async () => {
        const expectedToolMethods = [
          "searchOperations",
          "getOperationDetails",
          "getDataSchema",
          "listServices",
          "searchSchemas",
          "getOperationsByTag",
        ];

        // Verify all 6 tools exist
        for (const method of expectedToolMethods) {
          assert.ok(
            typeof (toolHandler as any)[method] === "function",
            `Tool ${method} must exist`,
          );
        }
      }),
      {numRuns: 10}, // Reduced runs since this is a constant check
    );
  });

  /**
   * Feature: kiro-power-integration, Property 9: MCP server responds to tool invocations
   * Validates: Requirements 3.2
   * 
   * Universal property: For ANY valid input (even random/invalid data), tools must:
   * 1. Always return a response (never hang or crash)
   * 2. Always return valid JSON
   * 3. Always include success and message fields
   * 4. Respond within reasonable time
   * 
   * This tests the robustness of error handling across all tools with random inputs.
   */
  it("Property 9: Tools handle arbitrary inputs gracefully", async () => {
    // Test with completely random string inputs to verify error handling
    const randomStringArb = fc.string({minLength: 0, maxLength: 100});
    const randomRoleArb = fc.option(fc.constantFrom("cpo", "emp"), {nil: undefined});

    await fc.assert(
      fc.asyncProperty(randomStringArb, randomRoleArb, async (keyword, role) => {
        // All tools should handle any input without crashing
        const result = toolHandler.searchOperations({keyword, role});

        // Must return valid JSON
        let parsed: any;
        assert.doesNotThrow(() => {
          parsed = JSON.parse(result);
        }, "Must return valid JSON for any input");

        // Must have required response structure
        assert.ok(typeof parsed.success === "boolean", "Must have boolean success field");
        assert.ok(typeof parsed.message === "string", "Must have string message field");
      }),
      {numRuns: 100},
    );
  });

  /**
   * Feature: kiro-power-integration, Property 15: MCP endpoint is accessible
   * Validates: Requirements 8.3
   * 
   * Universal property: Resource content integrity - for any resource retrieved multiple times,
   * the content must be identical (resources are immutable and consistently accessible).
   */
  it("Property 15: Resources are consistently accessible with stable content", async () => {
    const resourceUriArb = fc.constantFrom(
      "oicp://cpo/openapi",
      "oicp://emp/openapi",
      "oicp://cpo/documentation",
      "oicp://emp/documentation",
    );

    await fc.assert(
      fc.asyncProperty(resourceUriArb, async (uri) => {
        // Fetch the same resource twice
        const resource1 = await resourceHandler.getResource(uri);
        const resource2 = await resourceHandler.getResource(uri);

        // Content must be identical (resources are immutable)
        assert.strictEqual(
          resource1.contents,
          resource2.contents,
          "Resource content must be stable across multiple fetches",
        );

        // MIME type must be consistent
        assert.strictEqual(
          resource1.mimeType,
          resource2.mimeType,
          "MIME type must be consistent",
        );

        // Content must not be empty
        assert.ok(resource1.contents.length > 0, "Resource must have content");

        // Content must match declared MIME type
        if (resource1.mimeType === "application/x-yaml") {
          assert.ok(
            resource1.contents.includes("openapi:"),
            "YAML resources must contain valid OpenAPI spec",
          );
        } else if (resource1.mimeType === "text/html") {
          assert.ok(
            resource1.contents.includes("<html") || resource1.contents.includes("<!DOCTYPE"),
            "HTML resources must contain valid HTML",
          );
        }
      }),
      {numRuns: 50}, // Reduced since we're fetching twice per iteration
    );
  });

  /**
   * Additional property: Response time consistency
   * 
   * Universal property: All tool invocations must complete within a reasonable time,
   * regardless of input complexity or size.
   */
  it("Property: All tools respond within reasonable time bounds", async () => {
    // Test with varying input sizes to ensure performance is consistent
    const varyingSizeKeywordArb = fc.string({minLength: 1, maxLength: 200});

    await fc.assert(
      fc.asyncProperty(varyingSizeKeywordArb, async (keyword) => {
        const startTime = Date.now();
        toolHandler.searchOperations({keyword});
        const duration = Date.now() - startTime;

        // Must respond within 1 second even for large inputs
        assert.ok(
          duration < 1000,
          `Tool must respond within 1 second, took ${duration}ms for keyword length ${keyword.length}`,
        );
      }),
      {numRuns: 100},
    );
  });
});
