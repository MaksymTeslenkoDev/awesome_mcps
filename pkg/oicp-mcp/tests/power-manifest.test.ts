/**
 * Property-based tests for Power Manifest validation
 * Feature: kiro-power-integration
 */

import {describe, it} from "node:test";
import assert from "node:assert";
import * as fc from "fast-check";
import {readFileSync} from "node:fs";
import {join} from "node:path";

// Type definitions for power manifest
interface MCPServerConfig {
  command: string;
  args: string[];
  env?: Record<string, string>;
}

interface PowerManifest {
  name: string;
  version: string;
  displayName: string;
  description: string;
  keywords: string[];
  author?: string;
  license?: string;
  repository?: string;
  mcpServers: Record<string, MCPServerConfig>;
}

// Semver regex pattern
const SEMVER_PATTERN = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;

// Helper function to validate semver
function isValidSemver(version: string): boolean {
  return SEMVER_PATTERN.test(version);
}

// Helper function to check if manifest has required fields
function hasRequiredFields(manifest: any): boolean {
  return (
    typeof manifest.name === "string" &&
    typeof manifest.version === "string" &&
    typeof manifest.displayName === "string" &&
    typeof manifest.description === "string" &&
    Array.isArray(manifest.keywords) &&
    typeof manifest.mcpServers === "object" &&
    manifest.mcpServers !== null
  );
}

// Helper function to validate MCP server configuration
function isValidMCPServerConfig(config: any): boolean {
  return (
    typeof config.command === "string" &&
    config.command.trim().length > 0 &&  // Command must not be empty or whitespace-only
    Array.isArray(config.args) &&
    config.args.every((arg: any) => typeof arg === "string") &&
    (config.env === undefined || 
     config.env === null ||  // Allow null for optional env
     (typeof config.env === "object" && 
      config.env !== null &&
      Object.values(config.env).every((val: any) => typeof val === "string")))
  );
}

describe("Power Manifest Property Tests", () => {
  // Load the actual power.json for testing
  // Navigate up from pkg/oicp-mcp to workspace root
  const powerJsonPath = join(process.cwd(), "..", "..", "oicp-power", "power.json");
  let actualManifest: PowerManifest;

  try {
    actualManifest = JSON.parse(readFileSync(powerJsonPath, "utf-8"));
  } catch (error) {
    console.error("Failed to load power.json:", error);
    throw error;
  }

  describe("Property 1: Manifest contains required metadata fields", () => {
    it("should have all required fields in the actual manifest", () => {
      // Feature: kiro-power-integration, Property 1: Manifest contains required metadata fields
      // Validates: Requirements 4.1, 4.2, 4.4, 4.5
      
      assert.ok(hasRequiredFields(actualManifest), "Manifest should have all required fields");
      assert.strictEqual(typeof actualManifest.name, "string", "name should be a string");
      assert.strictEqual(typeof actualManifest.version, "string", "version should be a string");
      assert.strictEqual(typeof actualManifest.displayName, "string", "displayName should be a string");
      assert.strictEqual(typeof actualManifest.description, "string", "description should be a string");
      assert.ok(Array.isArray(actualManifest.keywords), "keywords should be an array");
      assert.ok(typeof actualManifest.mcpServers === "object", "mcpServers should be an object");
    });

    it("property: for any valid manifest, required fields must be present and correctly typed", () => {
      // Feature: kiro-power-integration, Property 1: Manifest contains required metadata fields
      // Validates: Requirements 4.1, 4.2, 4.4, 4.5
      
      fc.assert(
        fc.property(
          fc.record({
            name: fc.string({minLength: 1}),
            version: fc.string({minLength: 1}),
            displayName: fc.string({minLength: 1}),
            description: fc.string({minLength: 1}),
            keywords: fc.array(fc.string({minLength: 1}), {minLength: 1}),
            mcpServers: fc.dictionary(
              fc.string({minLength: 1}),
              fc.record({
                command: fc.string({minLength: 1}),
                args: fc.array(fc.string()),
                env: fc.option(fc.dictionary(fc.string(), fc.string())),
              })
            ),
            author: fc.option(fc.string()),
            license: fc.option(fc.string()),
            repository: fc.option(fc.string()),
          }),
          (manifest) => {
            // All required fields should be present and correctly typed
            return hasRequiredFields(manifest);
          }
        ),
        {numRuns: 100}
      );
    });
  });

  describe("Property 3: MCP server configuration is valid", () => {
    it("should have valid MCP server configuration in actual manifest", () => {
      // Feature: kiro-power-integration, Property 3: MCP server configuration is valid
      // Validates: Requirements 4.3, 6.4
      
      const serverNames = Object.keys(actualManifest.mcpServers);
      assert.ok(serverNames.length > 0, "Should have at least one MCP server");
      
      for (const serverName of serverNames) {
        const config = actualManifest.mcpServers[serverName];
        assert.ok(isValidMCPServerConfig(config), `MCP server ${serverName} should have valid configuration`);
        assert.strictEqual(typeof config.command, "string", "command should be a string");
        assert.ok(Array.isArray(config.args), "args should be an array");
        assert.ok(config.args.every(arg => typeof arg === "string"), "all args should be strings");
        
        if (config.env) {
          assert.ok(typeof config.env === "object", "env should be an object");
          assert.ok(
            Object.values(config.env).every(val => typeof val === "string"),
            "all env values should be strings"
          );
        }
      }
    });

    it("property: for any MCP server config, it must have valid command, args, and optional env", () => {
      // Feature: kiro-power-integration, Property 3: MCP server configuration is valid
      // Validates: Requirements 4.3, 6.4
      
      fc.assert(
        fc.property(
          fc.record({
            command: fc.string({minLength: 1}).filter(s => s.trim().length > 0),
            args: fc.array(fc.string()),
            env: fc.option(fc.dictionary(fc.string({minLength: 1}), fc.string())),
          }),
          (config) => {
            // Configuration should be valid
            return isValidMCPServerConfig(config);
          }
        ),
        {numRuns: 100}
      );
    });

    it("property: for any manifest with mcpServers, all server configs must be valid", () => {
      // Feature: kiro-power-integration, Property 3: MCP server configuration is valid
      // Validates: Requirements 4.3, 6.4
      
      fc.assert(
        fc.property(
          fc.dictionary(
            fc.string({minLength: 1}),
            fc.record({
              command: fc.string({minLength: 1}).filter(s => s.trim().length > 0),
              args: fc.array(fc.string()),
              env: fc.option(fc.dictionary(fc.string({minLength: 1}), fc.string())),
            }),
            {minKeys: 1}
          ),
          (mcpServers) => {
            // All server configurations should be valid
            return Object.values(mcpServers).every(config => isValidMCPServerConfig(config));
          }
        ),
        {numRuns: 100}
      );
    });
  });

  describe("Property 4: Version follows semantic versioning", () => {
    it("should have valid semver version in actual manifest", () => {
      // Feature: kiro-power-integration, Property 4: Version follows semantic versioning
      // Validates: Requirements 4.4
      
      assert.ok(isValidSemver(actualManifest.version), `Version ${actualManifest.version} should follow semver format`);
    });

    it("property: for any valid semver string, it must match the semver pattern", () => {
      // Feature: kiro-power-integration, Property 4: Version follows semantic versioning
      // Validates: Requirements 4.4
      
      fc.assert(
        fc.property(
          fc.tuple(
            fc.nat({max: 100}),  // major
            fc.nat({max: 100}),  // minor
            fc.nat({max: 100})   // patch
          ),
          ([major, minor, patch]) => {
            const version = `${major}.${minor}.${patch}`;
            return isValidSemver(version);
          }
        ),
        {numRuns: 100}
      );
    });

    it("property: for any semver with prerelease, it must still be valid", () => {
      // Feature: kiro-power-integration, Property 4: Version follows semantic versioning
      // Validates: Requirements 4.4
      
      fc.assert(
        fc.property(
          fc.tuple(
            fc.nat({max: 100}),  // major
            fc.nat({max: 100}),  // minor
            fc.nat({max: 100}),  // patch
            fc.option(fc.stringMatching(/^[0-9A-Za-z-]+(\.[0-9A-Za-z-]+)*$/))  // prerelease
          ),
          ([major, minor, patch, prerelease]) => {
            const version = prerelease 
              ? `${major}.${minor}.${patch}-${prerelease}`
              : `${major}.${minor}.${patch}`;
            return isValidSemver(version);
          }
        ),
        {numRuns: 100}
      );
    });

    it("property: invalid version strings should not match semver pattern", () => {
      // Feature: kiro-power-integration, Property 4: Version follows semantic versioning
      // Validates: Requirements 4.4
      
      const invalidVersions = [
        "1",
        "1.2",
        "v1.2.3",
        "1.2.3.4",
        "a.b.c",
        "1.2.x",
        "",
        "latest",
      ];

      for (const version of invalidVersions) {
        assert.strictEqual(
          isValidSemver(version),
          false,
          `Invalid version "${version}" should not match semver pattern`
        );
      }
    });
  });
});
