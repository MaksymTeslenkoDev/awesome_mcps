# Product Overview

## OICP MCP Server

A Model Context Protocol (MCP) server that exposes Hubject's Open InterCharge Protocol (OICP) v2.3 documentation to AI agents. Enables intelligent assistants to search, query, and retrieve information about electric vehicle charging infrastructure integration.

## Purpose

Provides AI agents with structured access to:
- Complete OICP v2.3 API specifications for CPO (Charge Point Operator) and EMP (e-Mobility Provider) roles
- OpenAPI schemas and data type definitions
- Operation endpoints and service documentation
- Visual diagrams and HTML documentation

## Key Capabilities

**MCP Resources** (via `oicp://` URI scheme):
- OpenAPI specifications (YAML)
- HTML documentation with diagrams
- 78+ technical diagrams (39 per role)

**MCP Tools** (6 search/query tools):
- `search_oicp_operations` - Find endpoints by keyword
- `get_operation_details` - Retrieve operation specifications
- `get_data_schema` - Access type definitions
- `list_services` - Browse available service tags
- `search_schemas` - Find data types
- `get_operations_by_tag` - List operations by service

## Target Users

- AI agents integrating with EV charging networks
- Developers building OICP-compliant systems
- MCP clients (Claude Desktop, Cursor, etc.) requiring OICP domain knowledge

## Official Documentation

- CPO: https://github.com/hubject/oicp-cpo-2.3-api-doc
- EMP: https://github.com/hubject/oicp-emp-2.3-api-doc
