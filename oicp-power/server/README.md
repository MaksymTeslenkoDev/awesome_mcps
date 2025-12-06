# OICP MCP Server

This directory contains the compiled OICP MCP server that powers the OICP Power.

## Installation

Before using the power, you need to install the server dependencies:

```bash
cd server
yarn install
```

Or if you prefer npm:

```bash
cd server
npm install
```

## Configuration

The server uses `local.config.json` for configuration. The configuration file is automatically loaded from the power package directory when Kiro starts the server.

### Configuration File Structure

```json
{
  "port": 2772,
  "host": "0.0.0.0",
  "logger": {
    "logLevel": "info",
    "pretty": true
  }
}
```

### Configuration Options

#### `port` (number)
- **Description**: The port number the server listens on
- **Default**: `2772`
- **Valid Range**: 1-65535
- **Example**: `3000`

#### `host` (string)
- **Description**: The host address the server binds to
- **Default**: `"0.0.0.0"` (listens on all network interfaces)
- **Local Only**: `"localhost"` or `"127.0.0.1"`
- **Remote Access**: `"0.0.0.0"` (allows connections from other machines)

#### `logger` (object)
- **Description**: Logging configuration for the server
- **Properties**:
  - `logLevel`: Log verbosity (`"trace"`, `"debug"`, `"info"`, `"warn"`, `"error"`, `"fatal"`)
  - `pretty`: Enable pretty-printed logs for development (`true` or `false`)

### CONFIG_PATH Environment Variable

You can override the default configuration file location by setting the `CONFIG_PATH` environment variable. This is useful for:
- Using different configurations for development vs production
- Storing configuration outside the power package
- Managing multiple server instances with different settings

**Usage:**
```bash
CONFIG_PATH=/path/to/custom/config.json node dist/pkg/oicp-mcp/server.js
```

The power.json manifest automatically sets this variable to point to the included `local.config.json`:
```json
{
  "env": {
    "CONFIG_PATH": "${powerPath}/server/local.config.json"
  }
}
```

### Deployment Examples

#### Local Development
For local development with pretty logs:

```json
{
  "port": 2772,
  "host": "localhost",
  "logger": {
    "logLevel": "debug",
    "pretty": true
  }
}
```

#### Production (Local Network)
For production use on a local network:

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

#### Remote Server
For remote server deployment accessible from other machines:

```json
{
  "port": 8080,
  "host": "0.0.0.0",
  "logger": {
    "logLevel": "warn",
    "pretty": false
  }
}
```

**Note**: When deploying remotely, ensure your firewall allows incoming connections on the configured port.

#### Custom Port
If port 2772 is already in use:

```json
{
  "port": 3000,
  "host": "localhost",
  "logger": {
    "logLevel": "info",
    "pretty": true
  }
}
```

When using a custom port, you'll need to update the power.json manifest or configure your MCP client to connect to the new port.

## Running the Server

The server is automatically started by Kiro when the power is activated. The power.json manifest configures the server to run with:

```bash
node ${powerPath}/server/dist/pkg/oicp-mcp/server.js
```

## Manual Testing

To test the server manually:

```bash
# Start the server
node dist/pkg/oicp-mcp/server.js

# In another terminal, test the MCP endpoint
curl -X POST http://localhost:2772/oicp/v2.3/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'
```

## Dependencies

The server requires Node.js v20 or higher (v22 LTS recommended).

Key dependencies:
- Fastify v5 - HTTP server
- @modelcontextprotocol/sdk - MCP protocol implementation
- Zod v4 - Schema validation
- js-yaml v4 - OpenAPI parsing

All dependencies are listed in `package.json` and will be installed when you run `yarn install`.
