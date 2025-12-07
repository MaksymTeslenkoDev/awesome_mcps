# OICP Power for Kiro

A Kiro Power that provides AI agents with comprehensive access to Hubject's Open InterCharge Protocol (OICP) v2.3 documentation for electric vehicle charging infrastructure integration.

## Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Available Tools](#available-tools)
- [Configuration](#configuration)
- [Troubleshooting](#troubleshooting)
- [Documentation](#documentation)

## Overview

The OICP Power connects Kiro to a workspace-based MCP (Model Context Protocol) server that exposes:
- Complete OICP v2.3 API specifications for CPO (Charge Point Operator) and EMP (e-Mobility Provider) roles
- 6 intelligent search and query tools for exploring the protocol
- 78+ technical diagrams and visual documentation
- Comprehensive schema definitions and operation details

### What is OICP?

OICP (Open InterCharge Protocol) is Hubject's industry-standard protocol for EV charging infrastructure, enabling:
- Real-time data exchange between charging networks
- Authorization and authentication of EV drivers
- Charging session management and billing
- Roaming capabilities across different charging networks

### What This Power Provides

- **Intelligent Search**: Find operations, schemas, and services by keyword
- **Detailed Documentation**: Access complete OpenAPI specifications and data models
- **Visual Diagrams**: View 78+ technical diagrams explaining protocol flows
- **Role-Specific Views**: Separate documentation for CPO and EMP perspectives
- **Workflow Guides**: Steering files with common implementation patterns

## Prerequisites

Before using the OICP Power, ensure you have:

- **Kiro IDE**: Latest version with Powers support
- **Node.js**: Version 20 or higher (v22 LTS recommended)
- **Yarn**: Package manager for building the MCP server

To check your Node.js version:
```bash
node --version
```

If you need to install or update Node.js, visit [nodejs.org](https://nodejs.org/).

## Installation

### Install via Kiro Powers Panel

The OICP Power is installed through the Kiro Powers Panel:

1. Open Kiro IDE
2. Access the Powers management panel:
   - Click on the Powers icon in the sidebar, or
   - Use Command Palette: `Kiro: Open Powers Panel`
3. Search for "OICP" or "EV charging"
4. Click "Install" on the OICP Protocol Assistant power
5. Wait for installation to complete

The power will be automatically configured and ready to use.

### Setting Up the MCP Server

The OICP Power connects to an MCP server that runs from your workspace:

```bash
# Navigate to the MCP server directory
cd pkg/oicp-mcp

# Install dependencies
yarn install
```

The server runs via stdio transport and doesn't require building for development use.

### Verifying Installation

After installation and building:

1. Open the Powers panel in Kiro
2. Look for "OICP Protocol Assistant" in your installed powers list
3. Verify the power shows as active with:
   - ✓ 1 MCP server configured
   - ✓ 6 tools available
   - ✓ 3 steering files included

If the server fails to start, see the [Troubleshooting](#troubleshooting) section.

## Usage

### Activating the Power

The OICP Power activates automatically when you mention OICP-related topics in your conversation with Kiro:

**Example queries that trigger activation:**
```
"I need to implement OICP authorization"
"How do I push EVSE data to Hubject?"
"Show me the charge point operator API"
"What's the schema for EMP authentication?"
```

**Keywords that trigger activation:**
- oicp, hubject
- ev, electric vehicle, charging
- cpo, charge point operator
- emp, e-mobility provider, e-roaming

You can also manually activate the power:
```
"Activate the OICP power"
```

### Using the Tools

Once activated, you can use the 6 MCP tools through natural conversation with Kiro. The tools are automatically invoked based on your questions.

**Example conversations:**

**Finding Operations:**
```
You: "Find all authorization operations for CPO"
Kiro: [Uses search_oicp_operations to find matching endpoints]
```

**Getting Operation Details:**
```
You: "Show me details for the authorize start operation"
Kiro: [Uses get_operation_details to retrieve full specification]
```

**Exploring Schemas:**
```
You: "What fields are in the EVSE data record?"
Kiro: [Uses get_data_schema to show the data structure]
```

**Browsing Services:**
```
You: "What services are available for EMP?"
Kiro: [Uses list_services to show all service categories]
```

**Searching Data Types:**
```
You: "Find all identification-related data types"
Kiro: [Uses search_schemas to locate relevant schemas]
```

**Querying by Service:**
```
You: "Show me all charging notification operations"
Kiro: [Uses get_operations_by_tag to list operations in that service]
```

### Accessing Steering Files

For detailed workflow guides, ask Kiro to show you the steering files:

```
"Show me the getting started guide for OICP"
"I need the CPO workflow documentation"
"Display the EMP workflows"
```

Available steering files:
- **getting-started.md** - First-time setup and basic queries
- **cpo-workflows.md** - Charge Point Operator workflows
- **emp-workflows.md** - e-Mobility Provider workflows

## Available Tools

The OICP Power provides 6 MCP tools for exploring the protocol. Kiro invokes these automatically based on your questions.

### 1. search_oicp_operations

Search for API operations by keyword across the OICP specification.

**Parameters:**
- `query` (string, required): Search term (e.g., "authorize", "evse", "charging")
- `role` (string, required): Either "cpo" or "emp"

**Example usage:**
```
"Find all operations related to reservations in the CPO API"
```

**Returns:** List of matching operations with IDs, descriptions, and HTTP methods.

### 2. get_operation_details

Retrieve complete details for a specific API operation.

**Parameters:**
- `operationId` (string, required): The operation ID (e.g., "eRoamingAuthorizeStart")
- `role` (string, required): Either "cpo" or "emp"

**Example usage:**
```
"Show me the full specification for eRoamingPushEvseData"
```

**Returns:** Complete operation details including parameters, request/response schemas, and descriptions.

### 3. get_data_schema

Access the definition of a specific data type or schema.

**Parameters:**
- `schemaName` (string, required): Name of the schema (e.g., "EvseDataRecord", "Identification")
- `role` (string, required): Either "cpo" or "emp"

**Example usage:**
```
"What's the structure of the ChargingNotificationStart schema?"
```

**Returns:** Complete schema definition with all fields, types, and constraints.

### 4. list_services

Browse all available service categories (tags) in the OICP specification.

**Parameters:**
- `role` (string, required): Either "cpo" or "emp"

**Example usage:**
```
"What service categories are available in the EMP API?"
```

**Returns:** List of all service tags with descriptions and operation counts.

### 5. search_schemas

Find data types and schemas by keyword.

**Parameters:**
- `query` (string, required): Search term (e.g., "authentication", "status", "pricing")
- `role` (string, required): Either "cpo" or "emp"

**Example usage:**
```
"Find all schemas related to pricing"
```

**Returns:** List of matching schemas with names and descriptions.

### 6. get_operations_by_tag

List all operations within a specific service category.

**Parameters:**
- `tag` (string, required): Service tag name (e.g., "eRoamingAuthorization", "eRoamingData")
- `role` (string, required): Either "cpo" or "emp"

**Example usage:**
```
"Show me all operations in the eRoamingEvseStatus service"
```

**Returns:** Complete list of operations in that service with details.

## Configuration

### MCP Server Configuration

The OICP Power uses stdio transport and runs via `yarn dev:stdio`. No HTTP configuration needed.

### Power Configuration

The power's MCP server connection is configured in `mcp.json`. The server uses stdio transport and communicates via stdin/stdout.

## Troubleshooting

### Installation Issues

**Problem**: Dependencies fail to install

**Solutions**:

1. **Verify Node.js version**:
   ```bash
   node --version  # Should be v20 or higher
   ```

2. **Clean install**:
   ```bash
   cd ${workspaceFolder}/pkg/oicp-mcp
   rm -rf node_modules yarn.lock
   yarn install
   ```

3. **Verify dependencies installed**:
   ```bash
   cd ${workspaceFolder}/pkg/oicp-mcp
   ls node_modules  # Should contain packages
   ```

### Power Not Connecting

**Problem**: Power installed but tools don't work

**Solutions**:

1. **Check Kiro MCP logs**:
   - Open Kiro output panel
   - Look for MCP server connection errors

2. **Verify mcp.json configuration**:
   - Check that `mcp.json` exists in `oicp-power/`
   - Verify it uses `yarn dev:stdio`
   - Ensure `cwd` points to `${workspaceFolder}/pkg/oicp-mcp`

3. **Restart Kiro**:
   - Reload the window or restart Kiro IDE
   - Reactivate the power

### Tools Return No Results

**Problem**: MCP tools execute but return empty or incorrect results

**Solutions**:

1. **Verify role parameter**:
   - Use "cpo" or "emp" (lowercase)
   - Some operations only exist in one role

2. **Check operation IDs**:
   - Use `search_oicp_operations` to find correct IDs
   - Operation IDs are case-sensitive (e.g., "eRoamingAuthorizeStart")

3. **Verify OpenAPI specs exist**:
   ```bash
   ls ${workspaceFolder}/pkg/oicp-mcp/oicp/v2.3/cpo/openapi.yaml
   ls ${workspaceFolder}/pkg/oicp-mcp/oicp/v2.3/emp/openapi.yaml
   ```

4. **Check server logs**:
   - Server logs to stderr
   - Check Kiro MCP output panel for error messages

### Getting More Help

If issues persist:

1. **Check Kiro MCP logs**: Look for error messages in the output panel
2. **Test server independently**: Run `yarn dev:stdio` manually in `pkg/oicp-mcp/`
3. **Verify workspace structure**: Ensure all files are in correct locations
4. **Check dependencies**: Run `yarn install` in `pkg/oicp-mcp/`

## Documentation

### Steering Files

Detailed workflow guides included with the power:

- **[getting-started.md](steering/getting-started.md)** - First-time setup and basic queries
- **[cpo-workflows.md](steering/cpo-workflows.md)** - Charge Point Operator implementation workflows
- **[emp-workflows.md](steering/emp-workflows.md)** - e-Mobility Provider implementation workflows

Access these by asking Kiro:
```
"Show me the getting started guide for OICP"
"I need the CPO workflow documentation"
```

### OICP Official Documentation

Official Hubject OICP v2.3 specifications:

- **CPO API Documentation**: [github.com/hubject/oicp-cpo-2.3-api-doc](https://github.com/hubject/oicp-cpo-2.3-api-doc)
- **EMP API Documentation**: [github.com/hubject/oicp-emp-2.3-api-doc](https://github.com/hubject/oicp-emp-2.3-api-doc)
- **Hubject Website**: [hubject.com](https://www.hubject.com)

### Power Documentation

- **[POWER.md](POWER.md)** - Complete power overview and quick reference
- **[mcp.json](mcp.json)** - MCP server configuration

## Version Information

- **OICP Version**: 2.3
- **MCP Server**: oicp-mcp-server (workspace-based)
- **Node.js**: ≥20.0.0 (v22 LTS recommended)
- **Package Manager**: Yarn v1

## License

This project is licensed under the MIT License.

## Support

For issues and questions:

1. Check the [Troubleshooting](#troubleshooting) section above
2. Review the [steering files](#steering-files) for usage guidance
3. Consult the [official OICP documentation](#oicp-official-documentation)
4. Open an issue on the project repository

---

**Note**: This power requires the workspace MCP server to be built and running. Ensure you've completed the [Installation](#installation) steps before using the tools.
