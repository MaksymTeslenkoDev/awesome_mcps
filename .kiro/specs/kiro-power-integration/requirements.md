# Requirements Document

## Introduction

This document outlines the requirements for transforming the OICP MCP server into a Kiro Power. A Kiro Power is a packaged bundle that includes documentation, workflow guides (steering files), and MCP servers, making domain-specific capabilities easily discoverable and usable by AI agents within the Kiro IDE.

The OICP MCP server currently provides AI agents with structured access to Hubject's Open InterCharge Protocol (OICP) v2.3 documentation. By packaging it as a Kiro Power, we will enable seamless integration with Kiro's power management system, allowing users to easily install, activate, and use OICP capabilities.

## Glossary

- **Kiro Power**: A packaged bundle containing documentation (POWER.md), optional steering files, and optional MCP servers that provide domain-specific capabilities to AI agents
- **MCP Server**: Model Context Protocol server that exposes tools and resources to AI agents
- **OICP**: Open InterCharge Protocol - Hubject's standard for EV charging infrastructure integration
- **Power Manifest**: Configuration file (power.json) that defines a Kiro Power's metadata, MCP servers, and capabilities
- **Steering Files**: Markdown documents that provide workflow guides and best practices for using a power
- **POWER.md**: Main documentation file that describes what a power does and how to use it
- **CPO**: Charge Point Operator role in OICP
- **EMP**: e-Mobility Provider role in OICP

## Requirements

### Requirement 1

**User Story:** As a Kiro user, I want to discover and install the OICP Power from the Powers management panel, so that I can access OICP documentation capabilities in my AI assistant.

#### Acceptance Criteria

1. WHEN a user opens the Powers management panel THEN the system SHALL display the OICP Power with its name, description, and keywords
2. WHEN a user views the OICP Power details THEN the system SHALL show that it includes one MCP server and documentation
3. WHEN a user installs the OICP Power THEN the system SHALL configure the MCP server connection automatically
4. WHERE the OICP Power is installed, WHEN a user activates it THEN the system SHALL load the POWER.md documentation and available tools

### Requirement 2

**User Story:** As a developer, I want the OICP Power to include comprehensive documentation, so that AI agents understand how to use OICP capabilities effectively.

#### Acceptance Criteria

1. WHEN the OICP Power is activated THEN the system SHALL provide POWER.md content describing OICP protocol overview
2. WHEN POWER.md is read THEN the document SHALL include sections for overview, available tools, resources, and usage examples
3. WHEN the documentation describes tools THEN each tool SHALL have a clear description of its purpose and parameters
4. WHEN the documentation describes resources THEN the URI scheme and available resource types SHALL be documented
5. WHEN examples are provided THEN they SHALL demonstrate common OICP integration workflows

### Requirement 3

**User Story:** As a Kiro user, I want the OICP Power to expose its MCP server tools through the standard Kiro Powers interface, so that I can use them consistently with other powers.

#### Acceptance Criteria

1. WHEN the OICP Power is activated THEN the system SHALL expose all six MCP tools through the toolsByServer map
2. WHEN a tool is invoked THEN the system SHALL route the request to the OICP MCP server endpoint
3. WHEN the MCP server is unavailable THEN the system SHALL provide a clear error message
4. WHERE the MCP server requires configuration, WHEN the power is installed THEN the system SHALL use default configuration values

### Requirement 4

**User Story:** As a developer, I want the OICP Power to include a proper manifest file, so that Kiro can correctly identify and manage the power.

#### Acceptance Criteria

1. WHEN the power manifest is parsed THEN the system SHALL extract the power name as "oicp-power"
2. WHEN the manifest is read THEN the system SHALL identify keywords including "oicp", "ev", "charging", "electric vehicle", "hubject"
3. WHEN the manifest lists MCP servers THEN the system SHALL include the oicp-mcp-server with its connection details
4. WHEN the manifest specifies version THEN the system SHALL use semantic versioning format
5. WHERE the manifest includes metadata, WHEN displayed THEN the system SHALL show author, license, and repository information

### Requirement 5

**User Story:** As a Kiro user, I want the OICP Power to include steering files with workflow guides, so that I can follow best practices for OICP integration tasks.

#### Acceptance Criteria

1. WHEN steering files are listed THEN the system SHALL include guides for common OICP workflows
2. WHEN a getting-started guide exists THEN the system SHALL provide step-by-step instructions for first-time users
3. WHEN workflow guides are provided THEN they SHALL cover both CPO and EMP role scenarios
4. WHERE examples are included, WHEN read THEN they SHALL demonstrate searching operations, retrieving schemas, and querying endpoints
5. WHEN steering files reference tools THEN they SHALL use the exact tool names from the MCP server

### Requirement 6

**User Story:** As a developer, I want the OICP Power structure to follow Kiro conventions, so that it integrates seamlessly with the Kiro ecosystem.

#### Acceptance Criteria

1. WHEN the power directory is examined THEN the system SHALL find POWER.md at the root level
2. WHEN the power directory is examined THEN the system SHALL find power.json manifest at the root level
3. WHERE steering files exist, WHEN the directory is examined THEN the system SHALL find them in a steering/ subdirectory
4. WHEN the MCP server configuration is specified THEN the system SHALL use the command and args format compatible with Kiro
5. WHERE the power includes the MCP server code, WHEN packaged THEN the system SHALL include necessary dependencies and build artifacts

### Requirement 7

**User Story:** As a Kiro user, I want the OICP Power to be proactively activated when I mention OICP-related topics, so that the AI assistant automatically provides relevant capabilities.

#### Acceptance Criteria

1. WHEN a user message contains "oicp" THEN the system SHALL match the power keyword and suggest activation
2. WHEN a user message contains "ev charging" or "electric vehicle" THEN the system SHALL match the power keywords
3. WHEN a user message contains "hubject" THEN the system SHALL match the power keyword
4. WHEN a user message contains "charge point operator" or "cpo" THEN the system SHALL match the power keywords
5. WHEN a user message contains "e-mobility provider" or "emp" THEN the system SHALL match the power keywords

### Requirement 8

**User Story:** As a developer, I want the OICP Power to support both local development and production deployment scenarios, so that it works in different environments.

#### Acceptance Criteria

1. WHERE the MCP server runs locally, WHEN the power is configured THEN the system SHALL connect to localhost on the configured port
2. WHERE the MCP server runs remotely, WHEN the power is configured THEN the system SHALL support custom host and port configuration
3. WHEN the MCP server is started THEN the system SHALL verify the /oicp/v2.3/mcp endpoint is accessible
4. WHERE configuration is missing, WHEN the power is activated THEN the system SHALL use default values from local.config.json
5. WHEN the power is packaged for distribution THEN the system SHALL include instructions for server deployment
