# OICP Protocol Assistant

## Overview

The OICP Protocol Assistant provides AI agents with comprehensive access to Hubject's **Open InterCharge Protocol (OICP) v2.3** documentation. OICP is the industry-standard protocol for electric vehicle (EV) charging infrastructure integration, enabling seamless interoperability between charge point operators and e-mobility service providers.

### What is OICP?

OICP (Open InterCharge Protocol) is a communication standard developed by Hubject that enables:
- Real-time data exchange between EV charging networks
- Authorization and authentication of EV drivers
- Charging session management and billing
- Dynamic pricing and availability information
- Roaming capabilities across different charging networks

### What This Power Provides

This power gives you intelligent access to:
- **Complete API Specifications**: Full OpenAPI documentation for both CPO and EMP roles
- **Schema Definitions**: Detailed data type specifications and validation rules
- **Operation Details**: Endpoint descriptions, parameters, and response formats
- **Visual Documentation**: 78+ technical diagrams explaining workflows and data structures
- **Search Capabilities**: Quickly find operations, schemas, and services by keyword

### CPO vs EMP Roles

OICP defines two primary roles in the EV charging ecosystem:

**CPO (Charge Point Operator)**
- Operates and maintains physical charging stations
- Pushes EVSE (Electric Vehicle Supply Equipment) data and status to the network
- Receives authorization requests from EMPs
- Sends charging notifications and charge detail records
- Manages reservations and remote start/stop operations

**EMP (e-Mobility Provider)**
- Provides charging services to EV drivers
- Pulls EVSE data and status from the network
- Sends authorization requests for charging sessions
- Manages customer authentication data
- Retrieves charge detail records for billing

Both roles interact through the OICP protocol to enable seamless roaming and charging experiences across different networks.

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

### Example 1: Searching for Authorization Operations

To find all authorization-related endpoints for CPO:

```json
{
  "tool": "search_oicp_operations",
  "arguments": {
    "query": "authorize",
    "role": "cpo"
  }
}
```

This returns operations like:
- `eRoamingAuthorizeStart` - Start charging authorization
- `eRoamingAuthorizeStop` - Stop charging authorization
- `eRoamingAuthorizeRemoteStart` - Remote start authorization
- `eRoamingAuthorizeRemoteStop` - Remote stop authorization

### Example 2: Retrieving Schema Details

To understand the structure of EVSE data:

```json
{
  "tool": "get_data_schema",
  "arguments": {
    "schemaName": "EvseDataRecord",
    "role": "cpo"
  }
}
```

This returns the complete schema with all fields, types, and validation rules for EVSE data records.

### Example 3: Querying by Service Tag

To see all operations in the charging notifications service:

```json
{
  "tool": "get_operations_by_tag",
  "arguments": {
    "tag": "eRoamingChargingNotifications",
    "role": "cpo"
  }
}
```

This returns all notification-related operations like ChargingNotificationStart, ChargingNotificationProgress, ChargingNotificationEnd, and ChargingNotificationError.

### Example 4: Finding Identification Schemas

To discover all identification-related data types:

```json
{
  "tool": "search_schemas",
  "arguments": {
    "query": "identification",
    "role": "emp"
  }
}
```

This returns schemas like RFIDIdentification, QRCodeIdentification, RemoteIdentification, and PlugAndChargeIdentification.

## Detailed Workflows

For step-by-step guides on common OICP integration tasks, see the steering files:

- **getting-started.md** - First-time setup and basic queries
- **cpo-workflows.md** - Charge Point Operator specific workflows
- **emp-workflows.md** - e-Mobility Provider specific workflows

These guides provide detailed examples of:
- Implementing EVSE data management
- Handling authorization flows
- Managing charging sessions
- Processing charge detail records
- Implementing reservation systems

## Getting Help

### Official OICP Documentation

- **CPO API**: https://github.com/hubject/oicp-cpo-2.3-api-doc
- **EMP API**: https://github.com/hubject/oicp-emp-2.3-api-doc
- **Hubject**: https://www.hubject.com

### Common Use Cases

**For CPO Implementations:**
- Use `search_oicp_operations` with "push" to find data publishing endpoints
- Use `get_operation_details` for "eRoamingPushEvseData" to understand EVSE data requirements
- Use `get_data_schema` for "EvseDataRecord" to see all required fields

**For EMP Implementations:**
- Use `search_oicp_operations` with "pull" to find data retrieval endpoints
- Use `get_operation_details` for "eRoamingPullEvseData" to understand data access
- Use `search_schemas` with "authentication" to find auth-related data types

### Tips for Effective Use

1. **Start broad, then narrow**: Use `list_services` to see categories, then `get_operations_by_tag` to explore specific areas
2. **Search by concept**: Use natural language terms like "charging", "status", "pricing" in search tools
3. **Check both roles**: Some operations exist in both CPO and EMP specs with different perspectives
4. **Use schemas for validation**: Always check schema definitions before implementing data structures
5. **Reference diagrams**: Use the images resources to understand complex workflows visually

## Version Information

- **OICP Version**: 2.3
- **Power Version**: 1.0.0
- **MCP Server**: oicp-mcp-server

This power is maintained to stay synchronized with the official OICP v2.3 specifications from Hubject.
