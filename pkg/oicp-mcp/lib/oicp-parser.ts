/**
 * OICP OpenAPI Parser
 * Loads and indexes OICP v2.3 OpenAPI specifications for CPO and EMP
 */

import {readFile} from "fs/promises";
import {join} from "path";
import * as yaml from "js-yaml";
import type {OpenAPIDocument, OICPIndex, ParsedOperation, OICPRole, OpenAPISchema} from "./types";

/**
 * OICPParser class for loading and indexing OICP documentation
 */
export class OICPParser {
  private index: OICPIndex | null = null;
  private readonly basePath: string;

  constructor(basePath: string) {
    this.basePath = basePath;
  }

  /**
   * Initialize the parser by loading and parsing both CPO and EMP OpenAPI specs
   */
  async initialize(): Promise<void> {
    const cpoDoc = await this.loadOpenAPISpec("cpo");
    const empDoc = await this.loadOpenAPISpec("emp");

    this.index = {
      cpo: {
        document: cpoDoc,
        operations: this.parseOperations(cpoDoc, "cpo"),
        schemas: cpoDoc.components?.schemas || {},
        tags: cpoDoc.tags?.map((t) => t.name) || [],
      },
      emp: {
        document: empDoc,
        operations: this.parseOperations(empDoc, "emp"),
        schemas: empDoc.components?.schemas || {},
        tags: empDoc.tags?.map((t) => t.name) || [],
      },
    };
  }

  /**
   * Load and parse an OpenAPI YAML file
   */
  private async loadOpenAPISpec(role: OICPRole): Promise<OpenAPIDocument> {
    const filePath = join(this.basePath, "oicp", "v2.3", role, "openapi.yaml");
    const fileContent = await readFile(filePath, "utf-8");
    const doc = yaml.load(fileContent) as OpenAPIDocument;

    if (!doc.openapi || !doc.paths) {
      throw new Error(`Invalid OpenAPI document for ${role.toUpperCase()}`);
    }

    return doc;
  }

  /**
   * Parse operations from an OpenAPI document
   */
  private parseOperations(doc: OpenAPIDocument, role: OICPRole): ParsedOperation[] {
    const operations: ParsedOperation[] = [];

    for (const [path, pathItem] of Object.entries(doc.paths)) {
      for (const [method, operation] of Object.entries(pathItem)) {
        // Skip non-operation fields (like parameters, servers, etc.)
        if (["get", "post", "put", "patch", "delete", "options", "head"].includes(method)) {
          operations.push({
            role,
            path,
            method: method.toUpperCase(),
            operationId: operation.operationId || `${method}_${path}`,
            summary: operation.summary,
            description: operation.description,
            tags: operation.tags || [],
            operation,
          });
        }
      }
    }

    return operations;
  }

  /**
   * Get the full index
   */
  getIndex(): OICPIndex {
    if (!this.index) {
      throw new Error("Parser not initialized. Call initialize() first.");
    }
    return this.index;
  }

  /**
   * Get OpenAPI document for a specific role
   */
  getDocument(role: OICPRole): OpenAPIDocument {
    if (!this.index) {
      throw new Error("Parser not initialized. Call initialize() first.");
    }
    return this.index[role].document;
  }

  /**
   * Search operations by keyword
   */
  searchOperations(keyword: string, role?: OICPRole): ParsedOperation[] {
    if (!this.index) {
      throw new Error("Parser not initialized. Call initialize() first.");
    }

    const lowerKeyword = keyword.toLowerCase();
    const rolesToSearch: OICPRole[] = role ? [role] : ["cpo", "emp"];
    const results: ParsedOperation[] = [];

    for (const r of rolesToSearch) {
      for (const op of this.index[r].operations) {
        const matchesOperationId = op.operationId.toLowerCase().includes(lowerKeyword);
        const matchesSummary = op.summary?.toLowerCase().includes(lowerKeyword);
        const matchesDescription = op.description?.toLowerCase().includes(lowerKeyword);
        const matchesPath = op.path.toLowerCase().includes(lowerKeyword);
        const matchesTags = op.tags.some((tag) => tag.toLowerCase().includes(lowerKeyword));

        if (
          matchesOperationId ||
          matchesSummary ||
          matchesDescription ||
          matchesPath ||
          matchesTags
        ) {
          results.push(op);
        }
      }
    }

    return results;
  }

  /**
   * Get operation by ID
   */
  getOperationById(operationId: string, role?: OICPRole): ParsedOperation | null {
    if (!this.index) {
      throw new Error("Parser not initialized. Call initialize() first.");
    }

    const rolesToSearch: OICPRole[] = role ? [role] : ["cpo", "emp"];

    for (const r of rolesToSearch) {
      const op = this.index[r].operations.find((o) => o.operationId === operationId);
      if (op) {
        return op;
      }
    }

    return null;
  }

  /**
   * Get operations by tag
   */
  getOperationsByTag(tag: string, role?: OICPRole): ParsedOperation[] {
    if (!this.index) {
      throw new Error("Parser not initialized. Call initialize() first.");
    }

    const rolesToSearch: OICPRole[] = role ? [role] : ["cpo", "emp"];
    const results: ParsedOperation[] = [];

    for (const r of rolesToSearch) {
      for (const op of this.index[r].operations) {
        if (op.tags.includes(tag)) {
          results.push(op);
        }
      }
    }

    return results;
  }

  /**
   * Get all operations for a role
   */
  getAllOperations(role: OICPRole): ParsedOperation[] {
    if (!this.index) {
      throw new Error("Parser not initialized. Call initialize() first.");
    }
    return this.index[role].operations;
  }

  /**
   * Get schema by name
   */
  getSchema(schemaName: string, role: OICPRole): OpenAPISchema | null {
    if (!this.index) {
      throw new Error("Parser not initialized. Call initialize() first.");
    }
    return this.index[role].schemas[schemaName] || null;
  }

  /**
   * Search schemas by keyword
   */
  searchSchemas(keyword: string, role?: OICPRole): Record<string, OpenAPISchema> {
    if (!this.index) {
      throw new Error("Parser not initialized. Call initialize() first.");
    }

    const lowerKeyword = keyword.toLowerCase();
    const rolesToSearch: OICPRole[] = role ? [role] : ["cpo", "emp"];
    const results: Record<string, OpenAPISchema> = {};

    for (const r of rolesToSearch) {
      for (const [name, schema] of Object.entries(this.index[r].schemas)) {
        const matchesName = name.toLowerCase().includes(lowerKeyword);
        const matchesDescription = schema.description?.toLowerCase().includes(lowerKeyword);

        if (matchesName || matchesDescription) {
          results[`${r}:${name}`] = schema;
        }
      }
    }

    return results;
  }

  /**
   * Get all tags for a role
   */
  getTags(role: OICPRole): string[] {
    if (!this.index) {
      throw new Error("Parser not initialized. Call initialize() first.");
    }
    return this.index[role].tags;
  }

  /**
   * Resolve a schema reference ($ref)
   */
  resolveSchemaRef(ref: string, role: OICPRole): OpenAPISchema | null {
    if (!this.index) {
      throw new Error("Parser not initialized. Call initialize() first.");
    }

    // OpenAPI refs typically look like: #/components/schemas/SchemaName
    const match = ref.match(/#\/components\/schemas\/(.+)/);
    if (match) {
      const schemaName = match[1];
      return this.index[role].schemas[schemaName] || null;
    }

    return null;
  }

  /**
   * Get service information (tags with descriptions)
   */
  getServices(role: OICPRole): Array<{name: string; description?: string}> {
    if (!this.index) {
      throw new Error("Parser not initialized. Call initialize() first.");
    }

    return this.index[role].document.tags || [];
  }
}
