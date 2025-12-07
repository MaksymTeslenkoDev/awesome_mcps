---
name: "oicp"
displayName: "OICP Protocol Assistant"
description: "Access Hubject's Open InterCharge Protocol (OICP) v2.3 documentation for EV charging infrastructure integration"
keywords: ["oicp","ev","charging","electric vehicle","hubject","cpo","emp","charge point","e-mobility","e-roaming"]
---

# OICP Protocol Assistant

Access Hubject's Open InterCharge Protocol (OICP) v2.3 documentation for EV charging infrastructure integration. OICP enables interoperability between Charge Point Operators (CPO) and e-Mobility Providers (EMP).

This power provides:
- 6 MCP tools for searching operations, schemas, and services
- Complete OpenAPI specifications for CPO and EMP roles
- 78+ technical diagrams via `oicp://` URI scheme
- Schema definitions with validation rules

# Onboarding

## Step 1: Verify Prerequisites

Before using OICP Protocol Assistant, ensure the following are installed:

- **Node.js v20+**: Required to run the MCP server
  - Verify with: `node --version`
  - **CRITICAL**: If Node.js is not installed or version is below v20, DO NOT proceed
- **Yarn v1**: Package manager for dependencies
  - Verify with: `yarn --version`

## Step 2: Explore Available Services

Start by discovering what OICP services are available:

```
Ask: "What OICP services are available for CPO?"
```

This uses the `list_services` tool to show service categories like:
- eRoamingAuthorization
- eRoamingData
- eRoamingEvseStatus
- eRoamingChargingNotifications
- eRoamingReservation

## Step 3: Search for Operations

Find specific API endpoints by keyword:

```
Ask: "Find authorization operations for CPO"
```

This uses `search_oicp_operations` to find relevant endpoints like:
- eRoamingAuthorizeStart
- eRoamingAuthorizeStop
- eRoamingAuthorizeRemoteStart

## Step 4: Get Detailed Information

Retrieve complete specifications for an operation:

```
Ask: "Show me details for eRoamingAuthorizeStart in CPO"
```

This uses `get_operation_details` to provide:
- Full endpoint description
- Request/response schemas
- Parameters and examples
- HTTP method and path

# Best Practices

## Understanding OICP Roles

**CPO (Charge Point Operator)** - Operates charging infrastructure:
- Push EVSE data and status to the network
- Handle authorization requests from EMPs
- Send charging notifications and CDRs
- Manage reservations and remote operations

**EMP (e-Mobility Provider)** - Provides charging services to drivers:
- Pull EVSE data and status from the network
- Send authorization requests for charging sessions
- Manage customer authentication data
- Retrieve charge detail records for billing

## Searching Effectively

**Start broad, then narrow:**
1. Use `list_services` to see available categories
2. Use `get_operations_by_tag` to explore specific service areas
3. Use `search_oicp_operations` with keywords for targeted searches

**Search by concept:**
- Use natural language terms: "charging", "status", "pricing", "identification"
- Try both singular and plural forms
- Search in both CPO and EMP contexts when relevant

## Working with Schemas

**Always validate data structures:**
```
Ask: "Show me the EvseDataRecord schema for CPO"
```

This ensures you understand:
- Required vs optional fields
- Data types and formats
- Validation rules and constraints
- Field descriptions and usage

## Example: Implementing Authorization Flow

```
1. Ask: "Find authorization operations for CPO"
2. Ask: "Show me details for eRoamingAuthorizeStart in CPO"
3. Ask: "Show me the eRoamingAuthorizeStart schema for CPO"
4. Ask: "Show me the AuthorizationStart schema for CPO"
```

This workflow gives you complete information to implement the authorization endpoint.

## Example: Managing EVSE Data

```
1. Ask: "What operations are in eRoamingData for CPO?"
2. Ask: "Show me details for eRoamingPushEvseData in CPO"
3. Ask: "Show me the EvseDataRecord schema for CPO"
```

This provides everything needed to push EVSE data to the network.

# When to Load Steering Files

- Getting started with OICP → `getting-started.md`
- Implementing CPO operations (push data, handle auth, send notifications) → `cpo-workflows.md`
- Implementing EMP operations (pull data, send auth, retrieve CDRs) → `emp-workflows.md`

# MCP Configuration

The power uses stdio transport (communicates via stdin/stdout).

**Verification:**
Ask your AI assistant: "List the available OICP services for CPO role"

**Troubleshooting:**
- Server won't start → Check Node.js version: `node --version` (requires v20+)
- Tools not appearing → Check Kiro MCP logs in output panel
- No search results → Verify role is "cpo" or "emp", try broader terms

**Resources:**
- CPO API: https://github.com/hubject/oicp-cpo-2.3-api-doc
- EMP API: https://github.com/hubject/oicp-emp-2.3-api-doc
- Issues: https://github.com/MaksymTeslenkoDev/awesome_mcps/issues
