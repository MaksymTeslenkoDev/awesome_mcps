# OICP Power for Kiro

A Kiro Power that provides AI agents with comprehensive access to Hubject's Open InterCharge Protocol (OICP) v2.3 documentation for electric vehicle charging infrastructure integration.

## Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Server Deployment](#server-deployment)
- [Usage](#usage)
- [Configuration](#configuration)
- [Troubleshooting](#troubleshooting)
- [Documentation](#documentation)

## Overview

The OICP Power packages an MCP (Model Context Protocol) server that exposes:
- Complete OICP v2.3 API specifications for CPO and EMP roles
- 6 intelligent search and query tools
- 78+ technical diagrams and visual documentation
- Comprehensive schema definitions and operation details

### What is OICP?

OICP (Open InterCharge Protocol) is Hubject's industry-standard protocol for EV charging infrastructure, enabling:
- Real-time data exchange between charging networks
- Authorization and authentication of EV drivers
- Charging session management and billing
- Roaming capabilities across different networks

## Prerequisites

Before installing the OICP Power, ensure you have:

- **Kiro IDE**: Latest version with Powers support
- **Node.js**: Version 20 or higher (v22 LTS recommended)
- **Operating System**: macOS, Linux, or Windows

To check your Node.js version:
```bash
node --version
```

If you need to install or update Node.js, visit [nodejs.org](https://nodejs.org/).

## Installation

### Method 1: Install via Kiro Powers Panel (Recommended)

1. Open Kiro IDE
2. Access the Powers management panel:
   - Click on the Powers icon in the sidebar, or
   - Use Command Palette: `Kiro: Open Powers Panel`
3. Search for "OICP" or "EV charging"
4. Click "Install" on the OICP Protocol Assistant power
5. Wait for installation to complete

The power will be automatically configured and ready to use.

### Method 2: Manual Installation

1. Download the OICP Power package (oicp-power-1.0.0.tar.gz)

2. Extract to your Kiro powers directory:
   ```bash
   # macOS/Linux
   tar -xzf oicp-power-1.0.0.tar.gz -C ~/.kiro/powers/
   
   # Windows
   # Extract to %USERPROFILE%\.kiro\powers\
   ```

3. Install server dependencies:
   ```bash
   cd ~/.kiro/powers/oicp-power/server
   npm install --production
   ```

4. Restart Kiro IDE to detect the new power

### Verifying Installation

After installation:

1. Open the Powers panel in Kiro
2. Look for "OICP Protocol Assistant" in your installed powers list
3. Verify the power shows:
   - ✓ 1 MCP server configured
   - ✓ 6 tools available
   - ✓ 3 steering files included

## Server Deployment

The OICP Power includes an MCP server that must be running to provide functionality. Kiro can manage this automatically, or you can run it manually for development.

### Automatic Deployment (Default)

When you activate the power in Kiro, the MCP server starts automatically:

1. The server runs on `localhost:2772` by default
2. Kiro manages the server lifecycle (start/stop/restart)
3. No manual intervention required

### Manual Local Deployment

For development or troubleshooting, you can start the server manually:

```bash
# Navigate to the server directory
cd ~/.kiro/powers/oicp-power/server

# Start the server
node dist/pkg/oicp-mcp/server.js
```

The server will start on the configured port (default: 2772) and log:
```
Server listening at http://0.0.0.0:2772
MCP endpoint available at /oicp/v2.3/mcp
```

### Remote Server Deployment

For production or shared environments, deploy the server remotely:

#### Option 1: Docker Deployment

```dockerfile
FROM node:22-alpine

WORKDIR /app
COPY server/ .

RUN npm install --production

EXPOSE 2772

CMD ["node", "dist/pkg/oicp-mcp/server.js"]
```

Build and run:
```bash
docker build -t oicp-mcp-server .
docker run -p 2772:2772 -e CONFIG_PATH=/app/local.config.json oicp-mcp-server
```

#### Option 2: Direct Deployment

1. Copy the `server/` directory to your remote host
2. Install dependencies: `npm install --production`
3. Configure the server (see [Configuration](#configuration))
4. Start with a process manager:

```bash
# Using PM2
pm2 start dist/pkg/oicp-mcp/server.js --name oicp-mcp

# Using systemd (create /etc/systemd/system/oicp-mcp.service)
[Unit]
Description=OICP MCP Server
After=network.target

[Service]
Type=simple
User=nodejs
WorkingDirectory=/opt/oicp-power/server
ExecStart=/usr/bin/node dist/pkg/oicp-mcp/server.js
Restart=on-failure
Environment=CONFIG_PATH=/opt/oicp-power/server/local.config.json

[Install]
WantedBy=multi-user.target
```

#### Configuring Kiro for Remote Server

Update the power configuration to point to your remote server:

1. Edit `~/.kiro/powers/oicp-power/power.json`
2. Modify the MCP server configuration:

```json
{
  "mcpServers": {
    "oicp-mcp-server": {
      "command": "node",
      "args": ["${powerPath}/server/dist/pkg/oicp-mcp/server.js"],
      "env": {
        "CONFIG_PATH": "${powerPath}/server/remote.config.json"
      }
    }
  }
}
```

3. Create `server/remote.config.json`:

```json
{
  "port": 2772,
  "host": "your-server.example.com",
  "logger": {
    "logLevel": "info",
    "pretty": false
  }
}
```

## Usage

### Activating the Power

Once installed, activate the OICP Power in Kiro:

#### Method 1: Manual Activation

1. Open a chat with Kiro
2. Type: "Activate the OICP power"
3. Kiro will load the power and display available tools

#### Method 2: Keyword-Based Activation (Automatic)

The power activates automatically when you mention OICP-related topics:

```
"I need to implement OICP authorization"
"How do I push EVSE data to Hubject?"
"Show me the charge point operator API"
"What's the schema for EMP authentication?"
```

Keywords that trigger activation:
- oicp, hubject
- ev, electric vehicle, charging
- cpo, charge point operator
- emp, e-mobility provider

### Using the Tools

Once activated, you can use the 6 MCP tools through natural conversation:

#### Example 1: Searching for Operations

```
You: "Find all authorization operations for CPO"

Kiro uses: search_oicp_operations
{
  "query": "authorize",
  "role": "cpo"
}
```

#### Example 2: Getting Operation Details

```
You: "Show me details for the authorize start operation"

Kiro uses: get_operation_details
{
  "operationId": "eRoamingAuthorizeStart",
  "role": "cpo"
}
```

#### Example 3: Retrieving Schemas

```
You: "What fields are in the EVSE data record?"

Kiro uses: get_data_schema
{
  "schemaName": "EvseDataRecord",
  "role": "cpo"
}
```

#### Example 4: Exploring Services

```
You: "What services are available for EMP?"

Kiro uses: list_services
{
  "role": "emp"
}
```

#### Example 5: Searching Schemas

```
You: "Find all identification-related data types"

Kiro uses: search_schemas
{
  "query": "identification",
  "role": "emp"
}
```

#### Example 6: Querying by Service Tag

```
You: "Show me all charging notification operations"

Kiro uses: get_operations_by_tag
{
  "tag": "eRoamingChargingNotifications",
  "role": "cpo"
}
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

## Configuration

### Server Configuration

The MCP server is configured via `server/local.config.json`:

```json
{
  "port": 2772,
  "host": "0.0.0.0",
  "logger": {
    "logLevel": "info",
    "pretty": false
  }
}
```

#### Configuration Options

**port** (number)
- Default: `2772`
- The port the MCP server listens on
- Valid range: 1-65535

**host** (string)
- Default: `"0.0.0.0"` (all interfaces)
- Use `"127.0.0.1"` for localhost only
- Use specific IP for remote access

**logger.logLevel** (string)
- Default: `"info"`
- Options: `"trace"`, `"debug"`, `"info"`, `"warn"`, `"error"`, `"fatal"`
- Use `"debug"` for troubleshooting

**logger.pretty** (boolean)
- Default: `false`
- Set to `true` for human-readable logs during development
- Keep `false` for production (JSON logs)

### Environment Variables

**CONFIG_PATH**
- Path to configuration file
- Default: `${powerPath}/server/local.config.json`
- Override to use custom configuration

Example:
```bash
CONFIG_PATH=/path/to/custom.config.json node dist/pkg/oicp-mcp/server.js
```

### Custom Configuration

To create a custom configuration:

1. Copy `server/local.config.json` to `server/custom.config.json`
2. Modify settings as needed
3. Update `power.json` to reference the new config:

```json
{
  "mcpServers": {
    "oicp-mcp-server": {
      "env": {
        "CONFIG_PATH": "${powerPath}/server/custom.config.json"
      }
    }
  }
}
```

## Troubleshooting

### Power Not Appearing in Kiro

**Problem**: OICP Power doesn't show in the Powers panel

**Solutions**:
1. Restart Kiro IDE
2. Check installation directory: `~/.kiro/powers/oicp-power/`
3. Verify `power.json` exists and is valid JSON
4. Check Kiro logs for power loading errors

### Server Won't Start

**Problem**: MCP server fails to start

**Solutions**:

1. **Check Node.js version**:
   ```bash
   node --version  # Should be v20 or higher
   ```

2. **Verify server files exist**:
   ```bash
   ls ~/.kiro/powers/oicp-power/server/dist/pkg/oicp-mcp/server.js
   ```

3. **Check for port conflicts**:
   ```bash
   # macOS/Linux
   lsof -i :2772
   
   # Windows
   netstat -ano | findstr :2772
   ```
   
   If port is in use, either:
   - Stop the conflicting process
   - Change port in `local.config.json`

4. **Install dependencies**:
   ```bash
   cd ~/.kiro/powers/oicp-power/server
   npm install --production
   ```

5. **Check server logs**:
   - Look for error messages in Kiro's output panel
   - Run server manually to see detailed errors:
     ```bash
     cd ~/.kiro/powers/oicp-power/server
     node dist/pkg/oicp-mcp/server.js
     ```

### Tools Not Working

**Problem**: MCP tools return errors or no results

**Solutions**:

1. **Verify server is running**:
   ```bash
   curl http://localhost:2772/oicp/v2.3/ping
   # Should return: {"status":"ok"}
   ```

2. **Check MCP endpoint**:
   ```bash
   curl -X POST http://localhost:2772/oicp/v2.3/mcp \
     -H "Content-Type: application/json" \
     -d '{"method":"tools/list"}'
   ```
   
   Should return list of 6 tools.

3. **Verify role parameter**:
   - Ensure you're using "cpo" or "emp" (lowercase)
   - Some operations only exist in one role

4. **Check operation IDs**:
   - Use `search_oicp_operations` to find correct IDs
   - Operation IDs are case-sensitive

### Connection Timeout

**Problem**: Requests to MCP server timeout

**Solutions**:

1. **Increase timeout in Kiro settings** (if available)

2. **Check server performance**:
   ```bash
   # Monitor server process
   top -p $(pgrep -f "oicp-mcp")
   ```

3. **Verify network connectivity**:
   ```bash
   ping localhost
   telnet localhost 2772
   ```

4. **Check firewall settings**:
   - Ensure port 2772 is not blocked
   - Add exception for Node.js if needed

### Invalid Configuration

**Problem**: Server starts but behaves incorrectly

**Solutions**:

1. **Validate JSON syntax**:
   ```bash
   cat server/local.config.json | python -m json.tool
   ```

2. **Reset to defaults**:
   ```bash
   cp server/local.config.json.backup server/local.config.json
   ```

3. **Check environment variables**:
   ```bash
   echo $CONFIG_PATH
   ```

### Permission Errors

**Problem**: Cannot read files or start server

**Solutions**:

1. **Fix file permissions**:
   ```bash
   chmod -R 755 ~/.kiro/powers/oicp-power/
   chmod 644 ~/.kiro/powers/oicp-power/server/local.config.json
   ```

2. **Check ownership**:
   ```bash
   ls -la ~/.kiro/powers/oicp-power/
   ```

3. **Run with appropriate user**:
   - Don't run as root unless necessary
   - Ensure user has read access to power directory

### Getting More Help

If issues persist:

1. **Check Kiro documentation**: Look for MCP and Powers troubleshooting guides
2. **Review server logs**: Enable debug logging in `local.config.json`
3. **Test server independently**: Run server manually and test with curl
4. **Verify OICP specs**: Ensure OpenAPI files are present in `server/oicp/v2.3/`

## Documentation

### Power Documentation

- **POWER.md** - Complete power overview and tool reference
- **steering/getting-started.md** - First-time user guide
- **steering/cpo-workflows.md** - CPO implementation workflows
- **steering/emp-workflows.md** - EMP implementation workflows

### OICP Official Documentation

- **CPO API**: https://github.com/hubject/oicp-cpo-2.3-api-doc
- **EMP API**: https://github.com/hubject/oicp-emp-2.3-api-doc
- **Hubject**: https://www.hubject.com

### MCP Protocol

- **MCP Specification**: https://modelcontextprotocol.io
- **MCP SDK**: https://github.com/modelcontextprotocol/typescript-sdk

## Version Information

- **Power Version**: 1.0.0
- **OICP Version**: 2.3
- **MCP Server**: oicp-mcp-server
- **Node.js**: ≥20.0.0 (v22 LTS recommended)

## License

MIT License - See LICENSE file for details

## Contributing

Contributions are welcome! Please see CONTRIBUTING.md for guidelines.

## Support

For issues and questions:
- Open an issue on GitHub
- Check the troubleshooting section above
- Review the steering files for usage guidance

---

**Note**: This power requires an active MCP server connection. Ensure the server is running and accessible before using the tools.
