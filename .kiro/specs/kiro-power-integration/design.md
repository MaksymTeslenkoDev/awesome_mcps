# Design Document

## Overview

This design document describes how to transform the existing OICP MCP server into a Kiro Power. The transformation involves creating a power package structure that wraps the existing MCP server with additional metadata, documentation, and workflow guides.

The design maintains the existing OICP MCP server functionality while adding the necessary Kiro Power components. The power will be distributed as a standalone package that users can install through Kiro's Powers management interface.

## Architecture

### High-Level Structure

```
oicp-power/
├── POWER.md                    # Main power documentation
├── power.json                  # Power manifest and configuration
├── steering/                   # Workflow guides
│   ├── getting-started.md
│   ├── cpo-workflows.md
│   └── emp-workflows.md
├── server/                     # MCP server (existing pkg/oicp-mcp)
│   ├── dist/                   # Compiled server
│   ├── package.json
│   └── [server files]
└── README.md                   # Installation and usage
```

### Integration Points

1. **Kiro Powers System**: The power.json manifest enables Kiro to discover and manage the power
2. **MCP Protocol**: The existing MCP server continues to handle tool and resource requests
3. **Power Activation**: POWER.md provides context when users activate the power
4. **Workflow Guidance**: Steering files guide users through common OICP tasks

## Components and Interfaces

### Power Manifest (power.json)

The manifest file defines the power's identity and configuration:

```json
{
  "name": "oicp-power",
  "version": "1.0.0",
  "displayName": "OICP Protocol Assistant",
  "description": "Access Hubject's Open InterCharge Protocol (OICP) v2.3 documentation for EV charging infrastructure integration",
  "keywords": ["oicp", "ev", "charging", "electric vehicle", "hubject", "cpo", "emp", "charge point", "e-mobility"],
  "author": "Your Name",
  "license": "MIT",
  "repository": "https://github.com/yourusername/oicp-power",
  "mcpServers": {
    "oicp-mcp-server": {
      "command": "node",
      "args": ["${powerPath}/server/dist/pkg/oicp-mcp/server.js"],
      "env": {
        "CONFIG_PATH": "${powerPath}/server/local.config.json"
      }
    }
  }
}
```

**Key Design Decisions:**
- Use `${powerPath}` variable for portable paths
- Reference compiled server (dist/) for production use
- Include environment variable for config file location
- Keywords cover OICP domain terms for proactive activation

### POWER.md Documentation

The main documentation file follows this structure:

1. **Overview**: What OICP is and what the power provides
2. **Available Tools**: Detailed description of all 6 MCP tools
3. **Available Resources**: Documentation of the oicp:// URI scheme
4. **Usage Examples**: Common workflows and patterns
5. **CPO vs EMP Roles**: Explanation of the two OICP roles
6. **Getting Help**: Links to steering files and external docs

**Content Organization:**
- Start with high-level concepts before diving into details
- Include code examples for each tool
- Provide context about when to use each tool
- Link to steering files for detailed workflows

### Steering Files

Three workflow guides provide step-by-step instructions:

**getting-started.md**
- First-time setup and activation
- Understanding OICP basics
- Running your first queries
- Exploring available operations

**cpo-workflows.md**
- Charge Point Operator specific tasks
- Push EVSE data operations
- Authorization handling
- Charging notifications

**emp-workflows.md**
- e-Mobility Provider specific tasks
- Pull EVSE data operations
- Authentication data management
- Charge detail records

### MCP Server Integration

The existing MCP server remains unchanged but is packaged within the power:

**Server Location**: `server/` directory contains the full oicp-mcp package
**Build Process**: Server must be compiled before packaging
**Configuration**: Default config included, can be overridden by users
**Endpoint**: Server runs on configured port (default 2772)

## Data Models

### Power Manifest Schema

```typescript
interface PowerManifest {
  name: string;                    // kebab-case identifier
  version: string;                 // semver format
  displayName: string;             // Human-readable name
  description: string;             // Short description
  keywords: string[];              // Search/activation keywords
  author?: string;                 // Author name or organization
  license?: string;                // SPDX license identifier
  repository?: string;             // Git repository URL
  mcpServers: {
    [serverName: string]: MCPServerConfig;
  };
}

interface MCPServerConfig {
  command: string;                 // Executable command
  args: string[];                  // Command arguments
  env?: Record<string, string>;    // Environment variables
}
```

### MCP Server Tools

The power exposes 6 tools through the MCP server:

```typescript
interface OICPTools {
  search_oicp_operations: {
    input: { query: string; role?: 'cpo' | 'emp' };
    output: Operation[];
  };
  
  get_operation_details: {
    input: { operationId: string; role: 'cpo' | 'emp' };
    output: OperationDetails;
  };
  
  get_data_schema: {
    input: { schemaName: string; role: 'cpo' | 'emp' };
    output: SchemaDefinition;
  };
  
  list_services: {
    input: { role: 'cpo' | 'emp' };
    output: string[];
  };
  
  search_schemas: {
    input: { query: string; role?: 'cpo' | 'emp' };
    output: Schema[];
  };
  
  get_operations_by_tag: {
    input: { tag: string; role: 'cpo' | 'emp' };
    output: Operation[];
  };
}
```

### MCP Resources

Resources use the `oicp://` URI scheme:

```typescript
type OICPResourceURI = 
  | `oicp://cpo/spec`              // CPO OpenAPI spec
  | `oicp://emp/spec`              // EMP OpenAPI spec
  | `oicp://cpo/docs`              // CPO HTML docs
  | `oicp://emp/docs`              // EMP HTML docs
  | `oicp://cpo/images/${string}`  // CPO diagram images
  | `oicp://emp/images/${string}`; // EMP diagram images
```


## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

Property 1: Manifest contains required metadata fields
*For any* valid power.json file, it should contain the required fields: name, version, displayName, description, keywords, and mcpServers
**Validates: Requirements 1.1, 4.1, 4.2, 4.5**

Property 2: All required keywords are present
*For any* valid power.json file, the keywords array should contain all OICP-related terms: "oicp", "ev", "charging", "electric vehicle", "hubject", "cpo", "emp"
**Validates: Requirements 4.2, 7.2, 7.4, 7.5**

Property 3: MCP server configuration is valid
*For any* MCP server entry in power.json, it should have command, args, and optional env fields with correct types
**Validates: Requirements 4.3, 6.4**

Property 4: Version follows semantic versioning
*For any* version string in power.json, it should match the semver pattern (major.minor.patch)
**Validates: Requirements 4.4**

Property 5: POWER.md contains required sections
*For any* valid POWER.md file, it should contain sections for Overview, Available Tools, Available Resources, and Usage Examples
**Validates: Requirements 2.1, 2.2**

Property 6: All MCP tools are documented
*For any* valid POWER.md file, it should document all 6 MCP tools: search_oicp_operations, get_operation_details, get_data_schema, list_services, search_schemas, get_operations_by_tag
**Validates: Requirements 2.3**

Property 7: URI scheme is documented
*For any* valid POWER.md file, it should document the oicp:// URI scheme and available resource types
**Validates: Requirements 2.4**

Property 8: MCP server exposes all tools
*For any* running MCP server instance, querying the tools list should return exactly 6 tools
**Validates: Requirements 3.1**

Property 9: MCP server responds to tool invocations
*For any* valid tool request to the MCP server, the server should return a response (success or error) within a reasonable timeout
**Validates: Requirements 3.2**

Property 10: Default configuration is valid
*For any* local.config.json file, it should contain valid port, host, and logger configuration
**Validates: Requirements 3.4, 8.4**

Property 11: Required steering files exist
*For any* valid power package, the steering/ directory should contain getting-started.md, cpo-workflows.md, and emp-workflows.md
**Validates: Requirements 5.1, 5.3**

Property 12: Steering files use correct tool names
*For any* tool name referenced in steering files, it should match one of the 6 actual MCP tool names
**Validates: Requirements 5.5**

Property 13: Power structure follows conventions
*For any* valid power package, POWER.md and power.json should exist at the root level, and steering files should be in steering/ subdirectory
**Validates: Requirements 6.1, 6.2, 6.3**

Property 14: Server artifacts are included
*For any* packaged power, the server/ directory should contain dist/, package.json, and local.config.json
**Validates: Requirements 6.5**

Property 15: MCP endpoint is accessible
*For any* running MCP server, sending a request to /oicp/v2.3/mcp should return a valid MCP response
**Validates: Requirements 8.3**

Property 16: Configuration supports custom host and port
*For any* valid configuration file, it should allow specifying custom host and port values
**Validates: Requirements 8.1, 8.2**

Property 17: Deployment instructions are included
*For any* valid README.md file, it should contain sections about server deployment and configuration
**Validates: Requirements 8.5**

## Error Handling

### Manifest Validation Errors

**Invalid JSON Format**
- Detection: JSON parsing fails when reading power.json
- Handling: Provide clear error message indicating line and column of syntax error
- Recovery: User must fix JSON syntax

**Missing Required Fields**
- Detection: Zod schema validation fails for power.json
- Handling: List all missing required fields in error message
- Recovery: User must add missing fields

**Invalid Semver Version**
- Detection: Version string doesn't match semver pattern
- Handling: Show expected format (e.g., "1.0.0") and actual value
- Recovery: User must correct version format

### MCP Server Connection Errors

**Server Not Running**
- Detection: Connection refused when trying to reach MCP endpoint
- Handling: Provide error message with server start instructions
- Recovery: User must start the MCP server

**Invalid Endpoint**
- Detection: HTTP 404 when accessing /oicp/v2.3/mcp
- Handling: Verify server is running and endpoint path is correct
- Recovery: Check server configuration and restart if needed

**Timeout**
- Detection: Request to MCP server exceeds timeout threshold
- Handling: Provide error message indicating server may be overloaded
- Recovery: Retry request or restart server

### File System Errors

**Missing Required Files**
- Detection: File not found when looking for POWER.md, power.json, or steering files
- Handling: List missing files and their expected locations
- Recovery: User must create missing files

**Invalid File Permissions**
- Detection: Permission denied when reading power files
- Handling: Show which files have permission issues
- Recovery: User must fix file permissions

**Corrupted Files**
- Detection: File exists but cannot be parsed (e.g., invalid markdown, corrupted JSON)
- Handling: Indicate which file is corrupted and what parsing error occurred
- Recovery: User must restore or recreate the file

### Configuration Errors

**Invalid Port Number**
- Detection: Port value is not a number or is outside valid range (1-65535)
- Handling: Show valid port range and current invalid value
- Recovery: User must specify valid port in config

**Port Already in Use**
- Detection: Server fails to bind to specified port
- Handling: Suggest checking for other processes using the port
- Recovery: User must stop conflicting process or choose different port

**Missing Environment Variables**
- Detection: Required env vars (like CONFIG_PATH) are not set
- Handling: List missing variables and their purpose
- Recovery: Use default values or prompt user to set variables

## Testing Strategy

### Unit Testing

Unit tests will verify individual components and file validation:

**Manifest Validation Tests**
- Test power.json schema validation with valid and invalid inputs
- Test semver version format validation
- Test required field presence checks
- Test MCP server configuration structure

**File Structure Tests**
- Test that required files exist in correct locations
- Test directory structure validation
- Test file readability checks

**Configuration Tests**
- Test local.config.json parsing and validation
- Test default value handling
- Test environment variable substitution

### Property-Based Testing

Property-based tests will use **fast-check** library for TypeScript to verify universal properties across many inputs.

**Configuration**: Each property test will run a minimum of 100 iterations.

**Tagging**: Each property-based test will include a comment with the format:
`// Feature: kiro-power-integration, Property N: <property description>`

**Test Coverage**:

1. Manifest structure properties (Properties 1-4)
2. Documentation completeness properties (Properties 5-7)
3. MCP server behavior properties (Properties 8-9)
4. Configuration validity properties (Properties 10, 16)
5. File structure properties (Properties 11-14)
6. Runtime behavior properties (Properties 15, 17)

**Generator Strategy**:
- Generate valid and invalid power.json structures
- Generate various configuration combinations
- Generate different file system layouts
- Generate MCP server responses

### Integration Testing

Integration tests will verify the complete power package works with Kiro:

**Power Installation Test**
- Install power through Kiro Powers interface
- Verify power appears in installed powers list
- Verify MCP server connection is established

**Power Activation Test**
- Activate power and verify POWER.md loads
- Verify tools are available in toolsByServer map
- Test tool invocation through Kiro interface

**Keyword Activation Test**
- Send messages with OICP keywords
- Verify power is suggested for activation
- Test with various keyword combinations

**MCP Server Integration Test**
- Start MCP server
- Send tool requests through Kiro
- Verify responses are correctly formatted
- Test all 6 tools with various inputs

**Steering File Integration Test**
- Access steering files through Kiro
- Verify markdown renders correctly
- Test links and references within steering files

### Manual Testing Checklist

- [ ] Install power in fresh Kiro instance
- [ ] Verify power appears in Powers panel with correct metadata
- [ ] Activate power and review POWER.md content
- [ ] Test each of the 6 MCP tools with sample queries
- [ ] Access each steering file and verify content
- [ ] Test keyword-based activation with various phrases
- [ ] Verify MCP server starts and responds correctly
- [ ] Test with custom configuration values
- [ ] Verify error messages are clear and helpful
- [ ] Test power uninstallation and cleanup

## Implementation Notes

### Build Process

The power package must include a compiled MCP server:

1. Build the MCP server: `cd pkg/oicp-mcp && yarn build`
2. Copy dist/ directory to power package
3. Include package.json and local.config.json
4. Verify all dependencies are listed in package.json

### Path Resolution

Use `${powerPath}` variable in power.json for portable paths:
- Kiro will substitute this with the actual power installation directory
- All file references should be relative to power root
- Server paths should use forward slashes for cross-platform compatibility

### Configuration Management

Support multiple configuration scenarios:

**Default Configuration**: Included local.config.json with sensible defaults
**Environment Override**: Allow CONFIG_PATH env var to point to custom config
**Runtime Configuration**: Support passing config through MCP server args

### Documentation Maintenance

Keep documentation synchronized:
- POWER.md should match actual MCP server capabilities
- Steering files should reference current tool names
- Examples should use valid OICP operation IDs
- Update version numbers consistently across all files

### Distribution

Package the power for distribution:

1. Create release directory with proper structure
2. Include compiled server in server/ directory
3. Add all documentation files
4. Include README.md with installation instructions
5. Create archive (zip or tar.gz) for distribution
6. Publish to power registry (if available)

### Versioning Strategy

Follow semantic versioning:
- **Major**: Breaking changes to power structure or MCP interface
- **Minor**: New features (additional tools, steering files)
- **Patch**: Bug fixes, documentation updates

Update version in:
- power.json
- server/package.json
- README.md
- POWER.md (if version is mentioned)
