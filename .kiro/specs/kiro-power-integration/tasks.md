# Implementation Plan

- [x] 1. Ensure power directory structure exists
  - Verify oicp-power/ directory exists at workspace root
  - Verify steering/ subdirectory exists
  - _Requirements: 3.1, 3.3_

- [x] 2. Create/verify mcp.json
  - Ensure mcp.json exists with mcpServers configuration
  - Verify it references ${workspaceFolder}/pkg/oicp-mcp/dist/pkg/oicp-mcp/server.js
  - Verify CONFIG_PATH env var points to ${workspaceFolder}/pkg/oicp-mcp/local.config.json
  - _Requirements: 2.1, 2.2, 2.3_

- [x] 3. Create/verify POWER.md
  - Ensure POWER.md has valid YAML frontmatter (name, displayName, description, keywords)
  - Ensure content is concise and focused on quick reference
  - _Requirements: 1.1, 1.2_

- [x] 4. Verify steering files exist (optional)
  - Check if getting-started.md exists in steering/
  - Check if cpo-workflows.md exists in steering/
  - Check if emp-workflows.md exists in steering/
  - _Requirements: 3.3_

- [x] 5. Verify MCP server is built
  - Confirm pkg/oicp-mcp/dist directory exists
  - Confirm pkg/oicp-mcp/dist/pkg/oicp-mcp/server.js exists
  - _Requirements: 2.2_

- [x] 6. Create/update README.md
  - [x] 6.1 Write Overview and Prerequisites sections
    - Describe what OICP is and what the power provides
    - List prerequisites: Node.js v20+, Kiro IDE
    - _Requirements: 4.1_

  - [x] 6.2 Write Installation section
    - Document installation via Kiro Powers Panel only
    - Include steps to build workspace MCP server with yarn
    - Remove any manual installation instructions
    - _Requirements: 4.1, 4.2_

  - [x] 6.3 Write Usage section with tool documentation
    - Document how to activate the power
    - Describe all 6 MCP tools with usage examples:
      - search_oicp_operations
      - get_operation_details
      - get_data_schema
      - list_services
      - search_schemas
      - get_operations_by_tag
    - Provide example queries for each tool
    - _Requirements: 4.3_

  - [x] 6.4 Write Configuration section
    - Reference workspace's pkg/oicp-mcp/local.config.json
    - Use ${workspaceFolder} in all path examples
    - Document environment variables
    - _Requirements: 4.4_

  - [x] 6.5 Write Troubleshooting section
    - Address common workspace-based server setup issues
    - Include server build problems
    - Include connection issues
    - Include configuration errors
    - _Requirements: 4.5_

  - [x] 6.6 Add Documentation Links section
    - Link to steering files
    - Link to official OICP documentation
    - Link to MCP protocol documentation
    - _Requirements: 4.1_
