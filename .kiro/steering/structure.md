# Project Structure

## Monorepo Layout

```
awesome_mcps/
├── pkg/oicp-mcp/          # OICP MCP server package
├── .cursor/               # Cursor IDE rules
├── .kiro/                 # Kiro steering documents
└── [root config files]    # Shared configs (tsconfig, eslint, prettier)
```

## OICP-MCP Package Structure

```
pkg/oicp-mcp/
├── server.ts              # Entry point - starts Fastify server
├── app.ts                 # Main app - registers plugins and routes
├── config.loader.ts       # Loads and validates configuration
│
├── config/                # Configuration modules
│   ├── index.ts          # Zod schemas and AppConfig type
│   └── server-options.ts # Fastify server options
│
├── lib/                   # Core library modules
│   ├── types.ts          # TypeScript type definitions
│   ├── oicp-parser.ts    # OpenAPI parser and indexer
│   ├── resource-handlers.ts # MCP resource handlers
│   └── tool-handlers.ts  # MCP tool handlers
│
├── plugins/               # Fastify plugins
│   └── mcp.ts            # MCP protocol server plugin
│
├── routes/                # HTTP route handlers
│   └── root.ts           # Health check endpoint
│
├── oicp/v2.3/            # OICP documentation
│   ├── cpo/              # CPO role documentation
│   │   ├── openapi.yaml  # CPO OpenAPI spec
│   │   ├── index.html    # CPO HTML docs
│   │   └── images/       # 39 diagram images
│   └── emp/              # EMP role documentation
│       ├── openapi.yaml  # EMP OpenAPI spec
│       ├── index.html    # EMP HTML docs
│       └── images/       # 39 diagram images
│
├── tests/                 # Test suite
│   ├── alive.test.ts     # Server health tests
│   ├── mcp-resources.test.ts # Resource handler tests
│   ├── mcp-tools.test.ts # Tool handler tests
│   ├── oicp-parser.test.ts # Parser tests
│   ├── helper.ts         # Test utilities
│   └── local.test.config.json # Test configuration
│
├── dist/                  # Build output (gitignored)
├── node_modules/          # Dependencies (gitignored)
├── local.config.json      # Runtime configuration
├── package.json           # Package manifest
├── tsconfig.json          # TypeScript config (extends root)
└── README.MD              # Package documentation
```

## Key File Responsibilities

### Entry Points
- `server.ts` - Initializes Fastify, loads config, starts listening on port 2772
- `app.ts` - Registers MCP plugin and routes with `/oicp/v2.3/` prefix

### Configuration
- `config.loader.ts` - Loads JSON config from `CONFIG_PATH` env var
- `config/index.ts` - Zod schemas for validation, AppConfig type
- `config/server-options.ts` - Fastify options (logging, etc.)
- `local.config.json` - Default runtime config (port, host, logger)

### Core Logic
- `lib/oicp-parser.ts` - Parses OpenAPI specs, indexes operations/schemas
- `lib/resource-handlers.ts` - Handles MCP resource requests (specs, docs, images)
- `lib/tool-handlers.ts` - Implements 6 MCP tools for searching/querying
- `lib/types.ts` - Shared TypeScript types

### Plugins & Routes
- `plugins/mcp.ts` - MCP server plugin, exposes `/mcp` endpoint
- `routes/root.ts` - Health check at `/ping`

### Documentation
- `oicp/v2.3/cpo/` - CPO role OpenAPI spec + HTML docs + images
- `oicp/v2.3/emp/` - EMP role OpenAPI spec + HTML docs + images
- `docs/` - Empty placeholder for future docs

## Naming Conventions

- **Files**: kebab-case (`config-loader.ts`, `mcp-tools.test.ts`)
- **Types/Interfaces**: PascalCase (`AppConfig`, `OICPOperation`)
- **Functions/Variables**: camelCase (`loadConfig`, `searchOperations`)
- **Constants**: SCREAMING_SNAKE_CASE (`LOG_LEVEL`, `DEFAULT_PORT`)

## API Structure

All endpoints prefixed with `/oicp/v2.3/`:
- `POST /oicp/v2.3/mcp` - MCP protocol endpoint
- `POST /oicp/v2.3/ping` - Health check

## Module Organization

### Adding New Features

**New MCP Tool**:
1. Add handler to `lib/tool-handlers.ts`
2. Register in `plugins/mcp.ts`
3. Add tests to `tests/mcp-tools.test.ts`

**New Route**:
1. Create handler in `routes/`
2. Register in `app.ts` with prefix
3. Add tests to `tests/`

**New Config Option**:
1. Update schema in `config/index.ts`
2. Use in `config/server-options.ts` or handlers
3. Document in `local.config.json`

## Build Artifacts

- `dist/` contains compiled JS + copied resources
- `.deployignore` controls which files are excluded during build
- Source maps generated for debugging
- `package.json` copied to dist for deployment
