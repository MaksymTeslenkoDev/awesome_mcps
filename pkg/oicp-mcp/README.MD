# Hubject OICP Integration MCP Server

A Model Context Protocol (MCP) server providing AI agents with access to Hubject OICP v2.3 documentation for CPO (Charge Point Operator) and EMP (e-Mobility Provider) integrations.

## Overview

This MCP server exposes the complete Hubject OICP v2.3 protocol documentation through standardized MCP resources and tools, enabling AI agents to:

- Search and retrieve OICP operations and endpoints
- Access complete OpenAPI specifications
- Query data schemas and type definitions
- Browse HTML documentation and diagrams
- Discover services and their operations

## Official Documentation

- **CPO**: [Open InterCharge Protocol - CPO Documentation](https://github.com/hubject/oicp-cpo-2.3-api-doc)
- **EMP**: [Open InterCharge Protocol - EMP Documentation](https://github.com/hubject/oicp-emp-2.3-api-doc)

## Technology Stack

- **Runtime**: Node.js v22+
- **Language**: TypeScript v5
- **Framework**: Fastify v5
- **Protocol**: Model Context Protocol (MCP) SDK v1.21+
- **Validation**: Zod v4
- **Package Manager**: Yarn v1

## Installation

```bash
# Install dependencies
yarn install

# Build the project
yarn build

# Run in development mode with hot reload
yarn dev

# Run tests
yarn test
```

## Server Configuration

The server is configured via `local.config.json`:

```json
{"port": 2772, "host": "0.0.0.0", "logger": {"logLevel": "info", "pretty": true}}
```

## MCP Resources

The server exposes the following resources via the `oicp://` URI scheme:

### OpenAPI Specifications

- `oicp://cpo/openapi` - Complete CPO OpenAPI v3.0 specification (YAML)
- `oicp://emp/openapi` - Complete EMP OpenAPI v3.0 specification (YAML)

### HTML Documentation

- `oicp://cpo/documentation` - Full CPO HTML documentation
- `oicp://emp/documentation` - Full EMP HTML documentation

### Diagram Images

- `oicp://cpo/images/{imageName}` - CPO documentation diagrams (39 images)
- `oicp://emp/images/{imageName}` - EMP documentation diagrams (39 images)

## MCP Tools

The server provides six powerful tools for querying OICP documentation:

### 1. `search_oicp_operations`

Search for operations/endpoints by keyword.

**Arguments:**

- `keyword` (string, required): Search term for operation names, descriptions, paths, or tags
- `role` (string, optional): Filter by role (`"cpo"` or `"emp"`)

**Example:**

```json
{"keyword": "authorize", "role": "cpo"}
```

### 2. `get_operation_details`

Get detailed information about a specific operation.

**Arguments:**

- `operationId` (string, required): The operation ID (e.g., `"eRoamingAuthorizeStart_v2.1"`)
- `role` (string, optional): Role hint (`"cpo"` or `"emp"`)

**Example:**

```json
{"operationId": "eRoamingAuthorizeStart_v2.1", "role": "cpo"}
```

### 3. `get_data_schema`

Retrieve a specific data type/schema definition.

**Arguments:**

- `schemaName` (string, required): Name of the schema (e.g., `"EVSEDataRecord"`)
- `role` (string, required): Role to get schema from (`"cpo"` or `"emp"`)

**Example:**

```json
{"schemaName": "EVSEDataRecord", "role": "cpo"}
```

### 4. `list_services`

List all available services (tags) for a role.

**Arguments:**

- `role` (string, required): Role to list services for (`"cpo"` or `"emp"`)

**Example:**

```json
{"role": "cpo"}
```

### 5. `search_schemas`

Search for data schemas/types by keyword.

**Arguments:**

- `keyword` (string, required): Search term for schema names or descriptions
- `role` (string, optional): Filter by role (`"cpo"` or `"emp"`)

**Example:**

```json
{"keyword": "status", "role": "cpo"}
```

### 6. `get_operations_by_tag`

Get all operations belonging to a specific service tag.

**Arguments:**

- `tag` (string, required): Tag name (e.g., `"eRoamingAuthorization"`)
- `role` (string, optional): Filter by role (`"cpo"` or `"emp"`)

**Example:**

```json
{"tag": "eRoamingAuthorization", "role": "cpo"}
```

## OICP Services

### CPO Services (Charge Point Operator)

- **eRoamingAuthorization** - Authorization operations (5 operations)
- **eRoamingReservation** - Reservation management (2 operations)
- **eRoamingEvseData** - EVSE data management
- **eRoamingEvseStatus** - EVSE status management
- **eRoamingDynamicPricing** - Dynamic pricing (2 operations)
- **eRoamingChargingNotifications** - Charging notifications

### EMP Services (e-Mobility Provider)

- **eRoamingAuthorization** - Authorization operations (6 operations)
- **eRoamingReservation** - Reservation management (2 operations)
- **eRoamingAuthenticationData** - Authentication data management
- **eRoamingEvseData** - EVSE data retrieval
- **eRoamingEvseStatus** - EVSE status retrieval
- **eRoamingDynamicPricing** - Dynamic pricing (2 operations)
- **eRoamingChargingNotifications** - Charging notifications

## API Endpoints

The server exposes the following HTTP endpoints:

- `POST /oicp/v2.3/mcp` - MCP protocol endpoint for AI agents
- `POST /oicp/v2.3/ping` - Health check endpoint

## Development

### Project Structure

```
pkg/oicp-mcp/
├── lib/                      # Core library modules
│   ├── types.ts             # TypeScript type definitions
│   ├── oicp-parser.ts       # OpenAPI parser and indexer
│   ├── resource-handlers.ts # MCP resource handlers
│   └── tool-handlers.ts     # MCP tool handlers
├── plugins/
│   └── mcp.ts               # MCP server plugin
├── routes/
│   └── root.ts              # HTTP routes
├── config/                   # Configuration
│   ├── index.ts             # Config types and validation
│   └── server-options.ts    # Fastify options
├── tests/                    # Test suite
│   ├── oicp-parser.test.ts
│   ├── mcp-resources.test.ts
│   └── mcp-tools.test.ts
├── oicp/v2.3/               # OICP documentation
│   ├── cpo/                 # CPO documentation
│   │   ├── openapi.yaml
│   │   ├── index.html
│   │   └── images/          # 39 diagram images
│   └── emp/                 # EMP documentation
│       ├── openapi.yaml
│       ├── index.html
│       └── images/          # 39 diagram images
├── server.ts                # Entry point
├── app.ts                   # Main application
└── package.json
```

### Running Tests

```bash
# Run all tests
yarn test

# Tests will validate:
# - OpenAPI parsing and indexing
# - Resource retrieval (specs, docs, images)
# - Tool functionality (search, query, list)
```

## Usage with MCP Clients

This server can be integrated with any MCP-compatible client (like Claude Desktop, Cursor, etc.) by configuring the client to connect to:

```
http://localhost:2772/oicp/v2.3/mcp
```

## License

ISC

## Contributing

Contributions are welcome! Please ensure:

- All tests pass (`yarn test`)
- Code follows TypeScript best practices
- New features include appropriate tests
- Documentation is updated
