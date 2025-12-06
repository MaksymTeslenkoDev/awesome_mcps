/**
 * MCP Tool Handlers
 * Implements tools for searching and retrieving OICP information
 */

import {z} from "zod";
import type {OICPParser} from "./oicp-parser";
import type {OICPRole, ParsedOperation, OpenAPISchema} from "./types";

/**
 * Zod schemas for tool arguments validation
 */

export const SearchOperationsArgsSchema = z.object({
  keyword: z.string().describe("Keyword to search for in operation names, descriptions, or tags"),
  role: z.enum(["cpo", "emp"]).optional().describe("Filter by role (CPO or EMP)"),
});

export const GetOperationDetailsArgsSchema = z.strictObject({
  operationId: z.string().describe("The operation ID to retrieve details for"),
  role: z.enum(["cpo", "emp"]).optional().describe("Role hint (CPO or EMP)"),
});

export const GetDataSchemaArgsSchema = z.strictObject({
  schemaName: z.string().describe("Name of the schema/data type to retrieve"),
  role: z.enum(["cpo", "emp"]).describe("Role (CPO or EMP) to get schema from"),
});

export const ListServicesArgsSchema = z.strictObject({
  role: z.enum(["cpo", "emp"]).describe("Role to list services for (CPO or EMP)"),
});

export const SearchSchemasArgsSchema = z.strictObject({
  keyword: z.string().describe("Keyword to search for in schema names or descriptions"),
  role: z.enum(["cpo", "emp"]).optional().describe("Filter by role (CPO or EMP)"),
});

export const GetOperationsByTagArgsSchema = z.strictObject({
  tag: z.string().describe("Tag name to filter operations by"),
  role: z.enum(["cpo", "emp"]).optional().describe("Filter by role (CPO or EMP)"),
});

/**
 * Tool handler class for OICP queries
 */
export class ToolHandler {
  private readonly parser: OICPParser;

  constructor(parser: OICPParser) {
    this.parser = parser;
  }

  /**
   * Search for OICP operations by keyword
   */
  searchOperations(args: z.infer<typeof SearchOperationsArgsSchema>): string {
    const {keyword, role} = args;
    const operations = this.parser.searchOperations(keyword, role);

    if (operations.length === 0) {
      return JSON.stringify({
        success: true,
        message: `No operations found matching keyword: ${keyword}`,
        results: [],
      });
    }

    const results = operations.map((op) => ({
      role: op.role.toUpperCase(),
      operationId: op.operationId,
      method: op.method,
      path: op.path,
      summary: op.summary || "No summary",
      tags: op.tags,
    }));

    return JSON.stringify({
      success: true,
      message: `Found ${operations.length} operation(s) matching keyword: ${keyword}`,
      results,
    });
  }

  /**
   * Get detailed information about a specific operation
   */
  getOperationDetails(args: z.infer<typeof GetOperationDetailsArgsSchema>): string {
    const {operationId, role} = args;
    const operation = this.parser.getOperationById(operationId, role);

    if (!operation) {
      return JSON.stringify({success: false, message: `Operation not found: ${operationId}`});
    }

    const details = {
      role: operation.role.toUpperCase(),
      operationId: operation.operationId,
      method: operation.method,
      path: operation.path,
      summary: operation.summary,
      description: operation.description,
      tags: operation.tags,
      parameters: operation.operation.parameters?.map((p) => ({
        name: p.name,
        in: p.in,
        required: p.required || false,
        description: p.description,
        schema: p.schema,
      })),
      requestBody: operation.operation.requestBody
        ? {
            required: operation.operation.requestBody.required || false,
            description: operation.operation.requestBody.description,
            contentTypes: operation.operation.requestBody.content
              ? Object.keys(operation.operation.requestBody.content)
              : [],
          }
        : null,
      responses: operation.operation.responses
        ? Object.entries(operation.operation.responses).map(([code, response]) => ({
            statusCode: code,
            description: response.description,
            contentTypes: response.content ? Object.keys(response.content) : [],
          }))
        : [],
    };

    return JSON.stringify({
      success: true,
      message: `Operation details for: ${operationId}`,
      operation: details,
    });
  }

  /**
   * Get a specific data schema/type definition
   */
  getDataSchema(args: z.infer<typeof GetDataSchemaArgsSchema>): string {
    const {schemaName, role} = args;
    const schema = this.parser.getSchema(schemaName, role);

    if (!schema) {
      return JSON.stringify({
        success: false,
        message: `Schema not found: ${schemaName} in ${role.toUpperCase()}`,
      });
    }

    return JSON.stringify({
      success: true,
      message: `Schema definition for: ${schemaName}`,
      role: role.toUpperCase(),
      schemaName,
      schema: this.formatSchema(schema),
    });
  }

  /**
   * List all available services (tags) for a role
   */
  listServices(args: z.infer<typeof ListServicesArgsSchema>): string {
    const {role} = args;
    const services = this.parser.getServices(role);

    return JSON.stringify({
      success: true,
      message: `Available services for ${role.toUpperCase()}`,
      role: role.toUpperCase(),
      services: services.map((s) => ({
        name: s.name,
        description: s.description || "No description",
      })),
    });
  }

  /**
   * Search for schemas by keyword
   */
  searchSchemas(args: z.infer<typeof SearchSchemasArgsSchema>): string {
    const {keyword, role} = args;
    const schemas = this.parser.searchSchemas(keyword, role);
    const schemaList = Object.entries(schemas);

    if (schemaList.length === 0) {
      return JSON.stringify({
        success: true,
        message: `No schemas found matching keyword: ${keyword}`,
        results: [],
      });
    }

    const results = schemaList.map(([key, schema]) => {
      const [schemaRole, schemaName] = key.split(":");
      return {
        role: schemaRole.toUpperCase(),
        name: schemaName,
        type: schema.type || "object",
        description: schema.description || "No description",
      };
    });

    return JSON.stringify({
      success: true,
      message: `Found ${schemaList.length} schema(s) matching keyword: ${keyword}`,
      results,
    });
  }

  /**
   * Get operations by tag
   */
  getOperationsByTag(args: z.infer<typeof GetOperationsByTagArgsSchema>): string {
    const {tag, role} = args;
    const operations = this.parser.getOperationsByTag(tag, role);

    if (operations.length === 0) {
      return JSON.stringify({
        success: true,
        message: `No operations found with tag: ${tag}`,
        results: [],
      });
    }

    const results = operations.map((op) => ({
      role: op.role.toUpperCase(),
      operationId: op.operationId,
      method: op.method,
      path: op.path,
      summary: op.summary || "No summary",
    }));

    return JSON.stringify({
      success: true,
      message: `Found ${operations.length} operation(s) with tag: ${tag}`,
      results,
    });
  }

  /**
   * Format a schema for JSON output (simplify complex structures)
   */
  private formatSchema(schema: OpenAPISchema): any {
    const formatted: any = {type: schema.type, description: schema.description};

    if (schema.properties) {
      formatted.properties = Object.entries(schema.properties).reduce(
        (acc, [name, prop]) => {
          acc[name] = {
            type: prop.type,
            description: prop.description,
            required: schema.required?.includes(name) || false,
            format: prop.format,
            $ref: prop.$ref,
          };
          return acc;
        },
        {} as Record<string, any>,
      );
    }

    if (schema.items) {
      formatted.items = {type: schema.items.type, $ref: schema.items.$ref};
    }

    if (schema.$ref) {
      formatted.$ref = schema.$ref;
    }

    if (schema.enum) {
      formatted.enum = schema.enum;
    }

    if (schema.required) {
      formatted.required = schema.required;
    }

    return formatted;
  }
}
