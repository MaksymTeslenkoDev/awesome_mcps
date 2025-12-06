# Technology Stack

## Runtime & Language

- **Node.js**: v22 LTS (minimum v20)
- **TypeScript**: v5.9 with `NodeNext` module resolution
- **Package Manager**: Yarn v1

## Core Framework

- **Fastify v5**: HTTP server and plugin ecosystem
- **MCP SDK v1.21+**: Model Context Protocol implementation
- **Zod v4**: Runtime validation and type inference

## Key Libraries

- `fastify-plugin` v5 - Plugin encapsulation
- `js-yaml` v4 - OpenAPI spec parsing
- `pino-pretty` v13 - Development logging (dev only)

## Development Tools

- `tsx` v4 - Dev server with hot reload and test runner
- `typescript-eslint` v8 - Linting with flat config
- `prettier` v3 - Code formatting
- `jiti` v2 - Runtime ESM/TypeScript loading

## Common Commands

### Development
```bash
# Install dependencies
yarn install

# Start dev server with hot reload (port 2772)
yarn dev

# Type checking
yarn typecheck
```

### Building
```bash
# Clean build with resource copying
yarn build

# Copies non-TS files excluding node_modules
yarn copy:resources
```

### Testing
```bash
# Run test suite with Node.js test runner
yarn test

# Uses CONFIG_PATH=local.test.config.json
```

### Code Quality
```bash
# Lint code
yarn lint

# Fix linting issues
yarn lint:fix

# Format code
yarn format
```

## Configuration

- **Server config**: `local.config.json` (override via `CONFIG_PATH` env var)
- **Default endpoint**: `http://0.0.0.0:2772/oicp/v2.3/mcp`
- **TypeScript config**: Extends root `tsconfig.json`

## Build Output

- Compiled code: `dist/pkg/oicp-mcp/`
- Resources copied via rsync with `.deployignore` filtering
- Source maps enabled for debugging

## Environment Variables

- `CONFIG_PATH` - Path to config JSON (default: `local.config.json`)
- `NODE_ENV` - Environment mode (affects logging)

## Compatibility

- Minimum Node.js: v20
- Recommended: Node.js v22 LTS
- Fastify 5 requires Node ≥20
- All dependencies support Node 22
