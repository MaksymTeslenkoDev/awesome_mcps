# Requirements Document

## Introduction

Create a valid Kiro Power structure in `oicp-power/` directory that connects to the locally running OICP MCP server. The power includes only essential files: POWER.md with frontmatter, mcp.json configuration, and optional steering files.

## Glossary

- **Kiro Power**: Directory with POWER.md (with frontmatter) and optional mcp.json and steering files
- **POWER.md**: Required file with YAML frontmatter (name, displayName, description, keywords) and concise documentation
- **mcp.json**: Optional configuration file defining MCP server connection
- **Steering Files**: Optional workflow guides in steering/ subdirectory

## Requirements

### Requirement 1: POWER.md Structure

**User Story:** As a developer, I want POWER.md to have valid frontmatter and concise content.

#### Acceptance Criteria

1. WHEN POWER.md is read THEN it SHALL have YAML frontmatter with name, displayName, description, and keywords
2. WHEN POWER.md content is read THEN it SHALL be concise and focused on quick reference

### Requirement 2: mcp.json Configuration

**User Story:** As a developer, I want mcp.json to correctly reference the locally running MCP server.

#### Acceptance Criteria

1. WHEN mcp.json is read THEN it SHALL define mcpServers with oicp-mcp-server entry
2. WHEN mcp.json is read THEN it SHALL use ${workspaceFolder} to reference pkg/oicp-mcp/dist/pkg/oicp-mcp/server.js
3. WHEN mcp.json is read THEN it SHALL set CONFIG_PATH env var to ${workspaceFolder}/pkg/oicp-mcp/local.config.json

### Requirement 3: Power Structure

**User Story:** As a developer, I want the power directory to follow Kiro conventions.

#### Acceptance Criteria

1. WHEN the oicp-power directory is examined THEN it SHALL contain POWER.md at root level
2. WHEN the oicp-power directory is examined THEN it SHALL contain mcp.json at root level
3. WHERE steering files exist THEN they SHALL be in steering/ subdirectory

### Requirement 4: README.md Documentation

**User Story:** As a user, I want comprehensive README.md documentation aligned with the current power structure.

#### Acceptance Criteria

1. WHEN README.md is read THEN it SHALL provide installation instructions via Kiro Powers Panel only
2. WHEN README.md describes installation THEN it SHALL include steps to build the workspace MCP server using yarn
3. WHEN README.md documents tools THEN it SHALL describe all 6 MCP tools with usage examples
4. WHEN README.md provides configuration THEN it SHALL reference workspace paths using ${workspaceFolder}
5. WHEN README.md includes troubleshooting THEN it SHALL address workspace-based server setup issues
