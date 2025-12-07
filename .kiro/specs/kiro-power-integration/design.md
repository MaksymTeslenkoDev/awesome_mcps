# Design Document

## Overview

Create a valid Kiro Power structure in the `oicp-power/` directory that connects to the locally running OICP MCP server. The power contains only essential files required by Kiro Powers system.

## Power Structure

```
oicp-power/
├── POWER.md                    # Required: Power documentation with frontmatter
├── mcp.json                    # Required: MCP server configuration
└── steering/                   # Optional: Workflow guides
    ├── getting-started.md
    ├── cpo-workflows.md
    └── emp-workflows.md
```

The MCP server lives separately in `pkg/oicp-mcp/` and must be built before using the power.

## File Specifications

### 1. POWER.md (Required)

Must include frontmatter with metadata:

```yaml
---
name: "oicp"
displayName: "OICP Protocol Assistant"
description: "Access Hubject's Open InterCharge Protocol (OICP) v2.3 documentation"
keywords: ["oicp", "ev", "charging", "electric vehicle", "hubject", "cpo", "emp"]
---
```

Content should be concise with sections for:
- Brief overview
- Quick onboarding steps
- Best practices
- When to use steering files
- MCP configuration example

### 2. mcp.json (Required)

Defines connection to locally running MCP server:

```json
{
  "mcpServers": {
    "oicp-mcp-server": {
      "command": "node",
      "args": ["${workspaceFolder}/pkg/oicp-mcp/dist/pkg/oicp-mcp/server.js"],
      "env": {
        "CONFIG_PATH": "${workspaceFolder}/pkg/oicp-mcp/local.config.json"
      }
    }
  }
}
```

### 3. Steering Files (Optional)

Workflow guides in `steering/` directory:
- `getting-started.md` - First-time user guide
- `cpo-workflows.md` - CPO-specific workflows
- `emp-workflows.md` - EMP-specific workflows

### 4. README.md (Required)

Comprehensive documentation for users and developers:

**Structure:**
1. **Overview** - What OICP is and what the power provides
2. **Prerequisites** - Node.js v20+, Kiro IDE
3. **Installation** - Via Kiro Powers Panel only (no manual installation)
4. **Building the MCP Server** - Steps to build workspace server with yarn
5. **Usage** - How to activate and use the 6 MCP tools with examples
6. **Available Tools** - Detailed documentation of each tool:
   - `search_oicp_operations` - Find endpoints by keyword
   - `get_operation_details` - Get operation specifications
   - `get_data_schema` - Access type definitions
   - `list_services` - Browse service tags
   - `search_schemas` - Find data types
   - `get_operations_by_tag` - List operations by service
7. **Configuration** - Reference to workspace's pkg/oicp-mcp/local.config.json
8. **Troubleshooting** - Common issues with workspace-based setup
9. **Documentation Links** - Steering files and external resources

**Key Points:**
- Focus on Kiro Powers Panel installation (avoid manual steps)
- Emphasize workspace-based server architecture
- Use `${workspaceFolder}` in all path examples
- Provide clear examples for each tool
- Keep configuration simple and workspace-relative

## Implementation Notes

- No testing required for power package files
- MCP server must be built before power can be used: `cd pkg/oicp-mcp && yarn build`
- Use `${workspaceFolder}` in mcp.json for portable paths
- Keep POWER.md concise - it's for quick reference only
- README.md should be comprehensive - it's the main documentation
