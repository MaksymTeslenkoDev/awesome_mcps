/**
 * Types for OICP MCP Server
 */

/**
 * Role type for OICP - either CPO (Charge Point Operator) or EMP (e-Mobility Provider)
 */
export type OICPRole = "cpo" | "emp";

/**
 * OpenAPI 3.0 Operation Object (subset of relevant fields)
 */
export interface OpenAPIOperation {
  summary?: string;
  operationId?: string;
  description?: string;
  tags?: string[];
  parameters?: OpenAPIParameter[];
  requestBody?: OpenAPIRequestBody;
  responses?: Record<string, OpenAPIResponse>;
}

/**
 * OpenAPI 3.0 Parameter Object
 */
export interface OpenAPIParameter {
  name: string;
  in: "query" | "header" | "path" | "cookie";
  description?: string;
  required?: boolean;
  schema?: OpenAPISchema;
}

/**
 * OpenAPI 3.0 Request Body Object
 */
export interface OpenAPIRequestBody {
  description?: string;
  content?: Record<string, OpenAPIMediaType>;
  required?: boolean;
}

/**
 * OpenAPI 3.0 Response Object
 */
export interface OpenAPIResponse {
  description: string;
  content?: Record<string, OpenAPIMediaType>;
}

/**
 * OpenAPI 3.0 Media Type Object
 */
export interface OpenAPIMediaType {
  schema?: OpenAPISchema;
}

/**
 * OpenAPI 3.0 Schema Object (simplified)
 */
export interface OpenAPISchema {
  type?: string;
  properties?: Record<string, OpenAPISchema>;
  items?: OpenAPISchema;
  required?: string[];
  description?: string;
  $ref?: string;
  allOf?: OpenAPISchema[];
  anyOf?: OpenAPISchema[];
  oneOf?: OpenAPISchema[];
  enum?: string[];
  format?: string;
}

/**
 * OpenAPI 3.0 Document structure
 */
export interface OpenAPIDocument {
  openapi: string;
  info: {
    title: string;
    version: string;
    description?: string;
    contact?: {name?: string; url?: string; email?: string};
  };
  servers?: Array<{url: string; description?: string}>;
  paths: Record<string, Record<string, OpenAPIOperation>>;
  components?: {
    schemas?: Record<string, OpenAPISchema>;
    parameters?: Record<string, OpenAPIParameter>;
    responses?: Record<string, OpenAPIResponse>;
  };
  tags?: Array<{name: string; description?: string}>;
}

/**
 * Parsed operation with additional metadata for search
 */
export interface ParsedOperation {
  role: OICPRole;
  path: string;
  method: string;
  operationId: string;
  summary?: string;
  description?: string;
  tags: string[];
  operation: OpenAPIOperation;
}

/**
 * Indexed OICP data structure for efficient search
 */
export interface OICPIndex {
  cpo: {
    document: OpenAPIDocument;
    operations: ParsedOperation[];
    schemas: Record<string, OpenAPISchema>;
    tags: string[];
  };
  emp: {
    document: OpenAPIDocument;
    operations: ParsedOperation[];
    schemas: Record<string, OpenAPISchema>;
    tags: string[];
  };
}

/**
 * Search criteria for operations
 */
export interface OperationSearchCriteria {
  role?: OICPRole;
  keyword?: string;
  tag?: string;
  operationId?: string;
}

/**
 * MCP Resource URI structure
 */
export interface ResourceURI {
  role: OICPRole;
  type: "openapi" | "documentation" | "images";
  imageName?: string;
}
