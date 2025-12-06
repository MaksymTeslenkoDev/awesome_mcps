# Power Structure Validation

This document describes how to validate the OICP Power package structure.

## Overview

The `validate-structure.ts` script checks that the power package follows Kiro conventions and includes all required files in the correct locations.

## Requirements Validated

The script validates the following requirements:

- **Requirement 6.1**: POWER.md exists at root level
- **Requirement 6.2**: power.json manifest exists at root level
- **Requirement 6.3**: Steering files exist in steering/ subdirectory

## Running Validation

### Using npm/yarn script

```bash
cd oicp-power
yarn validate
```

### Using tsx directly

```bash
cd oicp-power
tsx validate-structure.ts
```

### Validating a different directory

```bash
tsx validate-structure.ts /path/to/power/directory
```

## What Gets Checked

### Required Files (Root Level)

- ✅ `POWER.md` - Main power documentation
- ✅ `power.json` - Power manifest with metadata and MCP server configuration
- ⚠️ `README.md` - Installation and usage instructions (optional but recommended)

### Power Manifest Schema

The script validates that `power.json` contains:

- `name` - Kebab-case identifier (e.g., "oicp-power")
- `version` - Semantic version (e.g., "1.0.0")
- `displayName` - Human-readable name
- `description` - Short description
- `keywords` - Array of search/activation keywords
- `mcpServers` - MCP server configurations with command, args, and optional env

Additional checks:
- Version follows semver format (major.minor.patch)
- Name uses kebab-case
- At least one MCP server is configured
- Uses `${powerPath}` variable for portable paths (recommended)

### Steering Files (Optional)

If `steering/` directory exists, the script checks for common workflow guides:

- `getting-started.md` - First-time user guide
- `cpo-workflows.md` - Charge Point Operator workflows
- `emp-workflows.md` - e-Mobility Provider workflows

### Server Directory (If Applicable)

If the power includes an MCP server, the script checks for:

- `server/dist/` - Compiled server code
- `server/package.json` - Server dependencies
- `server/local.config.json` - Default configuration

## Exit Codes

- `0` - Validation passed (all required checks passed)
- `1` - Validation failed (one or more errors found)

## Output Format

The script provides detailed output showing:

1. **File checks** - Which required files exist
2. **Schema validation** - Whether power.json is valid
3. **Structure checks** - Whether directories are organized correctly
4. **Summary** - Overall pass/fail status with error and warning counts

### Example Output

```
Validating power structure at: /path/to/oicp-power

Checking required files at root level...
  ✓ POWER.md
  ✓ power.json
  ✓ README.md (optional)

Validating power.json schema...
  ✓ Schema validation passed
  ✓ 1 MCP server(s) configured
  ✓ Uses ${powerPath} variable for portable paths

Checking steering files subdirectory...
  ✓ steering/ directory exists
  ✓ steering/getting-started.md
  ✓ steering/cpo-workflows.md
  ✓ steering/emp-workflows.md

Checking server directory structure...
  ✓ server/ directory exists
  ✓ server/dist
  ✓ server/package.json
  ✓ server/local.config.json

============================================================
VALIDATION SUMMARY
============================================================

✅ PASSED - All required checks passed
```

## Using in CI/CD

The validation script can be integrated into CI/CD pipelines:

```yaml
# Example GitHub Actions workflow
- name: Validate Power Structure
  run: |
    cd oicp-power
    yarn install
    yarn validate
```

## Programmatic Usage

The validator can also be imported and used programmatically:

```typescript
import { PowerValidator } from './validate-structure.js';

const validator = new PowerValidator('./oicp-power');
const result = validator.validate();

if (!result.valid) {
  console.error('Validation failed:', result.errors);
  process.exit(1);
}
```

## Common Issues

### Missing Required Files

**Error**: `Missing required file: POWER.md (Main power documentation)`

**Solution**: Create the missing file at the root level of the power directory.

### Invalid JSON

**Error**: `power.json is not valid JSON: Unexpected token...`

**Solution**: Fix the JSON syntax error in power.json. Use a JSON validator or linter.

### Invalid Semver Version

**Error**: `power.json validation error at version: Version must follow semver (e.g., 1.0.0)`

**Solution**: Update the version field to use semantic versioning format (major.minor.patch).

### Missing MCP Server Configuration

**Warning**: `No MCP servers defined in power.json`

**Solution**: Add at least one MCP server configuration to the `mcpServers` object in power.json.

### Not Using ${powerPath} Variable

**Warning**: `power.json does not use ${powerPath} variable for portable paths`

**Solution**: Update file paths in power.json to use `${powerPath}` instead of absolute or relative paths for better portability.

## Extending the Validator

To add custom validation checks:

1. Add a new method to the `PowerValidator` class
2. Call it from the `validate()` method
3. Use `this.errors.push()` for critical issues
4. Use `this.warnings.push()` for non-critical issues

Example:

```typescript
private checkCustomRequirement(): void {
  console.log('Checking custom requirement...');
  
  if (/* condition not met */) {
    this.errors.push('Custom requirement failed');
    console.log('  ✗ Custom check - FAILED');
  } else {
    console.log('  ✓ Custom check - PASSED');
  }
}
```
