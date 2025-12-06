# Getting Started with OICP Power

Welcome to the OICP Power! This guide will help you get started with using Hubject's Open InterCharge Protocol (OICP) v2.3 documentation through Kiro.

## What is OICP?

The Open InterCharge Protocol (OICP) is Hubject's standard for enabling interoperability in electric vehicle (EV) charging infrastructure. It defines how different parties in the EV charging ecosystem communicate with each other.

### Key Terminology

**OICP Roles:**
- **CPO (Charge Point Operator)**: Operates charging stations and provides charging services
- **EMP (e-Mobility Provider)**: Provides EV drivers with access to charging networks
- **Hubject**: The central platform that connects CPOs and EMPs

**Core Concepts:**
- **EVSE (Electric Vehicle Supply Equipment)**: A charging station or charging point
- **EVSE Data**: Static information about charging stations (location, capabilities, connectors)
- **EVSE Status**: Dynamic information about charging station availability
- **Authorization**: Process of validating if an EV driver can charge at a station
- **CDR (Charge Detail Record)**: Transaction record after a charging session

## Activating the Power

If you haven't already activated this power, you can do so by:

1. Mentioning OICP-related keywords in your conversation (e.g., "oicp", "ev charging", "hubject")
2. Manually activating through the Powers panel in Kiro
3. Using the command: "Activate the OICP power"

Once activated, you'll have access to all OICP documentation tools and resources.

## Available Tools

The OICP Power provides six tools for exploring the protocol:

1. **search_oicp_operations** - Search for API endpoints by keyword
2. **get_operation_details** - Get detailed information about a specific operation
3. **get_data_schema** - Retrieve schema definitions for data types
4. **list_services** - List all available service categories
5. **search_schemas** - Search for data type schemas
6. **get_operations_by_tag** - Get operations grouped by service tag

## Your First Queries

### Example 1: Explore Available Services

Start by seeing what services are available:

```
What services are available in OICP for CPO?
```

This will use the `list_services` tool to show you service categories like:
- eRoamingAuthorization
- eRoamingData
- eRoamingEvseStatus
- eRoamingChargingNotifications
- eRoamingReservation

### Example 2: Search for Operations

Search for operations related to a specific topic:

```
Search for operations related to "EVSE data" in the CPO role
```

This uses `search_oicp_operations` to find relevant endpoints like:
- eRoamingPushEvseData - Push charging station data to Hubject
- eRoamingPushEvseStatus - Update charging station availability

### Example 3: Get Operation Details

Once you find an operation, get its full details:

```
Get details for the eRoamingPushEvseData operation in CPO role
```

This uses `get_operation_details` to show:
- HTTP method and endpoint path
- Request body schema
- Response schema
- Description and usage notes

### Example 4: Explore Data Schemas

Look up the structure of data types:

```
What is the structure of the EvseDataRecord schema in CPO?
```

This uses `get_data_schema` to show all fields, types, and validation rules.

## Understanding CPO vs EMP

Most OICP operations are role-specific. When using the tools, you'll need to specify which role:

**CPO Operations** (Charge Point Operators):
- Push EVSE data and status to Hubject
- Receive authorization requests from EMPs
- Send charging notifications
- Receive remote start/stop commands

**EMP Operations** (e-Mobility Providers):
- Pull EVSE data and status from Hubject
- Push authentication data for their users
- Send authorization requests
- Retrieve charge detail records

## Exploring the Documentation

### Browse by Service Tag

To see all operations in a service category:

```
Show me all operations in the eRoamingAuthorization service for CPO
```

### Search Across Schemas

To find data types related to a concept:

```
Search for schemas related to "identification" in EMP role
```

### Access Full Specifications

You can also access the complete OpenAPI specifications:

```
Show me the CPO OpenAPI specification
```

This retrieves the full YAML specification using the resource URI `oicp://cpo/spec`.

## Next Steps

Now that you understand the basics, explore specific workflows:

- **For CPO implementations**: See [cpo-workflows.md](./cpo-workflows.md)
- **For EMP implementations**: See [emp-workflows.md](./emp-workflows.md)

## Common Questions

**Q: Do I need to specify the role for every query?**
A: Most operations are role-specific. If you don't specify, the tool may default to searching both roles or ask for clarification.

**Q: Can I see the actual API documentation?**
A: Yes! The power includes the complete HTML documentation. Ask to see the CPO or EMP documentation.

**Q: What version of OICP is supported?**
A: This power covers OICP v2.3, the current version of the protocol.

**Q: Where can I find example request/response payloads?**
A: Use `get_operation_details` to see the full schema for any operation, including examples.

## Tips for Effective Use

1. **Start broad, then narrow**: Use `list_services` and `search_operations` before diving into specific operations
2. **Understand the role**: Always know whether you're implementing CPO or EMP functionality
3. **Check schemas**: Use `get_data_schema` to understand complex data structures
4. **Follow workflows**: The workflow guides provide step-by-step implementation patterns
5. **Reference the spec**: When in doubt, access the full OpenAPI specification

Happy exploring! The OICP Power is here to help you build robust EV charging integrations.
