---
name: oicp-power
displayName: OICP Protocol Assistant
description: Access Hubject's Open InterCharge Protocol (OICP) v2.3 documentation for EV charging infrastructure integration
keywords: ["oicp","ev","charging","electric vehicle","hubject","cpo","emp","charge point","e-mobility"]
---

# OICP Protocol Assistant

## Overview

Access Hubject's Open InterCharge Protocol (OICP) v2.3 documentation for EV charging infrastructure integration. OICP enables interoperability between Charge Point Operators (CPO) and e-Mobility Providers (EMP).

This power provides:
- 6 MCP tools for searching operations, schemas, and services
- Complete OpenAPI specifications for CPO and EMP roles
- 78+ technical diagrams via `oicp://` URI scheme
- Schema definitions with validation rules

## Onboarding

### First Steps

1. **Explore available services:**
   ```
   Ask: "What OICP services are available for CPO?"
   ```
   Uses `list_services` tool to show service categories.

2. **Search for operations:**
   ```
   Ask: "Find authorization operations for CPO"
   ```
   Uses `search_oicp_operations` to find relevant endpoints.

3. **Get operation details:**
   ```
   Ask: "Show me details for eRoamingAuthorizeStart in CPO"
   ```
   Uses `get_operation_details` for complete specifications.

### Quick Reference

**CPO Role** - Charge Point Operators:
- Push EVSE data and status
- Handle authorization requests
- Send charging notifications
- Manage reservations

**EMP Role** - e-Mobility Providers:
- Pull EVSE data and status
- Send authorization requests
- Manage authentication data
- Retrieve charge detail records

### Common Workflows

See steering files for detailed guides:
- `getting-started.md` - Basic queries and setup
- `cpo-workflows.md` - CPO-specific workflows
- `emp-workflows.md` - EMP-specific workflows

## Available Tools

This power exposes 6 MCP tools for querying OICP documentation:

### 1. search_oicp_operations

Search for OICP API operations by keyword.

**Parameters:**
- `query` (string, required): Search term to find operations
- `role` (string, optional): Filter by role - "cpo" or "emp"

**Example:**
```json
{
  "query": "authorize",
  "role": "cpo"
}
```

**Returns:** Array of matching operations with operationId, summary, method, and path.

**Use when:** You need to find specific API endpoints related to authorization, charging, data management, etc.

---

### 2. get_operation_details

Retrieve complete details for a specific OICP operation.

**Parameters:**
- `operationId` (string, required): The operation identifier (e.g., "eRoamingAuthorizeStart")
- `role` (string, required): The role context - "cpo" or "emp"

**Example:**
```json
{
  "operationId": "eRoamingAuthorizeStart",
  "role": "cpo"
}
```

**Returns:** Full operation specification including description, parameters, request body schema, responses, and examples.

**Use when:** You need detailed information about a specific endpoint's requirements and behavior.

---

### 3. get_data_schema

Access detailed schema definitions for OICP data types.

**Parameters:**
- `schemaName` (string, required): Name of the schema (e.g., "EvseDataRecord", "eRoamingAuthorizeStart")
- `role` (string, required): The role context - "cpo" or "emp"

**Example:**
```json
{
  "schemaName": "EvseDataRecord",
  "role": "cpo"
}
```

**Returns:** Complete schema definition with properties, types, validation rules, and descriptions.

**Use when:** You need to understand data structures, validation requirements, or field definitions.

---

### 4. list_services

Browse available OICP service categories.

**Parameters:**
- `role` (string, required): The role context - "cpo" or "emp"

**Example:**
```json
{
  "role": "cpo"
}
```

**Returns:** Array of service tags like "eRoamingAuthorization", "eRoamingData", "eRoamingEvseStatus", etc.

**Use when:** You want to explore what categories of operations are available in OICP.

---

### 5. search_schemas

Find OICP data schemas by keyword.

**Parameters:**
- `query` (string, required): Search term to find schemas
- `role` (string, optional): Filter by role - "cpo" or "emp"

**Example:**
```json
{
  "query": "identification",
  "role": "emp"
}
```

**Returns:** Array of matching schemas with name and description.

**Use when:** You need to find data types related to specific concepts like identification, pricing, status, etc.

---

### 6. get_operations_by_tag

List all operations within a specific service category.

**Parameters:**
- `tag` (string, required): Service tag name (e.g., "eRoamingAuthorization")
- `role` (string, required): The role context - "cpo" or "emp"

**Example:**
```json
{
  "tag": "eRoamingAuthorization",
  "role": "cpo"
}
```

**Returns:** Array of operations in that service category with operationId, summary, method, and path.

**Use when:** You want to see all endpoints related to a specific service area.

## Available Resources

This power provides access to OICP documentation through the `oicp://` URI scheme.

### URI Scheme

Resources are accessed using the format: `oicp://{role}/{resource-type}/{optional-path}`

Where:
- `{role}` is either "cpo" or "emp"
- `{resource-type}` is "spec", "docs", or "images"
- `{optional-path}` is used for specific image files

### CPO Resources

**OpenAPI Specification:**
- URI: `oicp://cpo/spec`
- Format: YAML
- Content: Complete CPO API specification with all endpoints, schemas, and examples

**HTML Documentation:**
- URI: `oicp://cpo/docs`
- Format: HTML
- Content: Rendered documentation with navigation and visual formatting

**Diagram Images:**
- URI: `oicp://cpo/images/{filename}`
- Format: PNG
- Content: 39 technical diagrams including:
  - Authorization workflows (authorize_evco.png, authorizestart_online.png, etc.)
  - Data push operations (pushevsedata.png, pushevsestatus.png)
  - Charging notifications (chargingnotificationstart.png, etc.)
  - Reservation flows (remotereservationstart.png, etc.)
  - Architecture diagrams (security.png, web_services.png)

### EMP Resources

**OpenAPI Specification:**
- URI: `oicp://emp/spec`
- Format: YAML
- Content: Complete EMP API specification with all endpoints, schemas, and examples

**HTML Documentation:**
- URI: `oicp://emp/docs`
- Format: HTML
- Content: Rendered documentation with navigation and visual formatting

**Diagram Images:**
- URI: `oicp://emp/images/{filename}`
- Format: PNG
- Content: 39 technical diagrams including:
  - Authorization workflows
  - Data pull operations (pullevsedata.png, pullevsestatus.png)
  - Authentication data (pushauthentificationdata.png)
  - CDR retrieval (getcdr.png, eroaminggetcdrs.png)
  - Architecture diagrams

### Resource Access Examples

**Accessing the CPO OpenAPI spec:**
```
oicp://cpo/spec
```

**Accessing a specific diagram:**
```
oicp://cpo/images/authorizestart_online.png
```

**Accessing EMP documentation:**
```
oicp://emp/docs
```

## Usage Examples

**Search operations:**
```
"Find authorization operations for CPO"
```
Returns: eRoamingAuthorizeStart, eRoamingAuthorizeStop, etc.

**Get schema details:**
```
"Show me the EvseDataRecord schema for CPO"
```
Returns: Complete schema with fields, types, and validation rules.

**List operations by service:**
```
"What operations are in eRoamingChargingNotifications for CPO?"
```
Returns: ChargingNotificationStart, ChargingNotificationProgress, ChargingNotificationEnd, ChargingNotificationError.

**Access resources:**
```
"Get the CPO OpenAPI specification"
```
Returns: Content from `oicp://cpo/spec`

## Installation

**Prerequisites:** Node.js v20+, Yarn v1, MCP-compatible client

**From source:**
```bash
git clone https://github.com/MaksymTeslenkoDev/awesome_mcps.git
cd awesome_mcps
yarn install
cd pkg/oicp-mcp
yarn build
yarn start
```

**MCP Configuration** (`mcp.json`):
```json
{
  "mcpServers": {
    "oicp": {
      "command": "node",
      "args": ["/path/to/awesome_mcps/pkg/oicp-mcp/dist/server.js"],
      "env": {
        "CONFIG_PATH": "/path/to/awesome_mcps/pkg/oicp-mcp/local.config.json"
      }
    }
  }
}
```

**Verify:** Ask "List the available OICP services for CPO role"

## Configuration

**Server config** (`local.config.json`):
```json
{
  "server": {
    "host": "0.0.0.0",
    "port": 2772
  },
  "logger": {
    "level": "info",
    "prettyPrint": false
  }
}
```

**Environment variables:**
- `CONFIG_PATH` - Config file path (default: `./local.config.json`)

## Troubleshooting

**Server won't start:**
- Check Node.js version: `node --version` (requires v20+)
- Verify port 2772 is available
- Run `yarn install` to ensure dependencies

**Tools not appearing:**
- Restart MCP client
- Check server: `curl http://localhost:2772/oicp/v2.3/ping`
- Review MCP client logs

**No search results:**
- Verify role is "cpo" or "emp"
- Try broader search terms
- Use `list_services` first

**Debug mode:**
```json
{
  "logger": {
    "level": "debug",
    "prettyPrint": true
  }
}
```

## Resources

- **CPO API**: https://github.com/hubject/oicp-cpo-2.3-api-doc
- **EMP API**: https://github.com/hubject/oicp-emp-2.3-api-doc
- **Issues**: https://github.com/MaksymTeslenkoDev/awesome_mcps/issues
- **License**: MIT
