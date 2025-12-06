#!/usr/bin/env node
/**
 * Power Structure Validation Script
 * 
 * Validates that the OICP Power package follows Kiro conventions:
 * - Required files exist at correct locations (Requirements 6.1, 6.2, 6.3)
 * - power.json schema is valid
 * - File structure matches conventions
 */

import { readFileSync, existsSync, statSync } from 'fs';
import { join, resolve } from 'path';
import { z } from 'zod';

// Zod schema for power.json validation
const MCPServerConfigSchema = z.object({
  command: z.string(),
  args: z.array(z.string()),
  env: z.record(z.string()).optional(),
});

const PowerManifestSchema = z.object({
  name: z.string().regex(/^[a-z0-9-]+$/, 'Name must be kebab-case'),
  version: z.string().regex(/^\d+\.\d+\.\d+$/, 'Version must follow semver (e.g., 1.0.0)'),
  displayName: z.string(),
  description: z.string(),
  keywords: z.array(z.string()).min(1, 'At least one keyword is required'),
  author: z.string().optional(),
  license: z.string().optional(),
  repository: z.string().optional(),
  mcpServers: z.record(MCPServerConfigSchema),
});

interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

class PowerValidator {
  private powerPath: string;
  private errors: string[] = [];
  private warnings: string[] = [];

  constructor(powerPath: string) {
    this.powerPath = resolve(powerPath);
  }

  /**
   * Run all validation checks
   */
  validate(): ValidationResult {
    console.log(`Validating power structure at: ${this.powerPath}\n`);

    // Check required files at root level (Requirement 6.1, 6.2)
    this.checkRequiredFiles();

    // Validate power.json schema
    this.validateManifest();

    // Check steering files subdirectory (Requirement 6.3)
    this.checkSteeringFiles();

    // Check server directory structure
    this.checkServerStructure();

    return {
      valid: this.errors.length === 0,
      errors: this.errors,
      warnings: this.warnings,
    };
  }

  /**
   * Check that required files exist at root level
   * Requirements 6.1, 6.2
   */
  private checkRequiredFiles(): void {
    const requiredFiles = [
      { path: 'POWER.md', description: 'Main power documentation' },
      { path: 'power.json', description: 'Power manifest' },
    ];

    console.log('Checking required files at root level...');
    for (const file of requiredFiles) {
      const filePath = join(this.powerPath, file.path);
      if (!existsSync(filePath)) {
        this.errors.push(`Missing required file: ${file.path} (${file.description})`);
        console.log(`  ✗ ${file.path} - MISSING`);
      } else if (!statSync(filePath).isFile()) {
        this.errors.push(`${file.path} exists but is not a file`);
        console.log(`  ✗ ${file.path} - NOT A FILE`);
      } else {
        console.log(`  ✓ ${file.path}`);
      }
    }

    // Check optional README.md
    const readmePath = join(this.powerPath, 'README.md');
    if (existsSync(readmePath)) {
      console.log(`  ✓ README.md (optional)`);
    } else {
      this.warnings.push('README.md not found (recommended but optional)');
      console.log(`  ⚠ README.md - MISSING (optional)`);
    }

    console.log();
  }

  /**
   * Validate power.json schema and content
   */
  private validateManifest(): void {
    console.log('Validating power.json schema...');
    const manifestPath = join(this.powerPath, 'power.json');

    if (!existsSync(manifestPath)) {
      // Already reported in checkRequiredFiles
      console.log('  ✗ Cannot validate - file missing\n');
      return;
    }

    try {
      const content = readFileSync(manifestPath, 'utf-8');
      const manifest = JSON.parse(content);

      // Validate against schema
      const result = PowerManifestSchema.safeParse(manifest);

      if (!result.success) {
        console.log('  ✗ Schema validation failed:');
        result.error.errors.forEach((err) => {
          const path = err.path.join('.');
          this.errors.push(`power.json validation error at ${path}: ${err.message}`);
          console.log(`    - ${path}: ${err.message}`);
        });
      } else {
        console.log('  ✓ Schema validation passed');

        // Additional checks
        if (Object.keys(result.data.mcpServers).length === 0) {
          this.warnings.push('No MCP servers defined in power.json');
          console.log('  ⚠ No MCP servers defined');
        } else {
          console.log(`  ✓ ${Object.keys(result.data.mcpServers).length} MCP server(s) configured`);
        }

        // Check for ${powerPath} variable usage
        const manifestStr = JSON.stringify(manifest);
        if (!manifestStr.includes('${powerPath}')) {
          this.warnings.push('power.json does not use ${powerPath} variable for portable paths');
          console.log('  ⚠ ${powerPath} variable not used (recommended for portable paths)');
        } else {
          console.log('  ✓ Uses ${powerPath} variable for portable paths');
        }
      }
    } catch (error) {
      if (error instanceof SyntaxError) {
        this.errors.push(`power.json is not valid JSON: ${error.message}`);
        console.log(`  ✗ Invalid JSON: ${error.message}`);
      } else {
        this.errors.push(`Failed to read power.json: ${error}`);
        console.log(`  ✗ Read error: ${error}`);
      }
    }

    console.log();
  }

  /**
   * Check steering files subdirectory
   * Requirement 6.3
   */
  private checkSteeringFiles(): void {
    console.log('Checking steering files subdirectory...');
    const steeringPath = join(this.powerPath, 'steering');

    if (!existsSync(steeringPath)) {
      this.warnings.push('steering/ subdirectory not found (optional but recommended)');
      console.log('  ⚠ steering/ directory - MISSING (optional)\n');
      return;
    }

    if (!statSync(steeringPath).isDirectory()) {
      this.errors.push('steering/ exists but is not a directory');
      console.log('  ✗ steering/ - NOT A DIRECTORY\n');
      return;
    }

    console.log('  ✓ steering/ directory exists');

    // Check for common steering files
    const commonSteeringFiles = [
      'getting-started.md',
      'cpo-workflows.md',
      'emp-workflows.md',
    ];

    let foundFiles = 0;
    for (const file of commonSteeringFiles) {
      const filePath = join(steeringPath, file);
      if (existsSync(filePath)) {
        console.log(`  ✓ steering/${file}`);
        foundFiles++;
      }
    }

    if (foundFiles === 0) {
      this.warnings.push('No steering files found in steering/ directory');
      console.log('  ⚠ No steering files found');
    }

    console.log();
  }

  /**
   * Check server directory structure
   */
  private checkServerStructure(): void {
    console.log('Checking server directory structure...');
    const serverPath = join(this.powerPath, 'server');

    if (!existsSync(serverPath)) {
      this.warnings.push('server/ directory not found (required if power includes MCP server)');
      console.log('  ⚠ server/ directory - MISSING\n');
      return;
    }

    if (!statSync(serverPath).isDirectory()) {
      this.errors.push('server/ exists but is not a directory');
      console.log('  ✗ server/ - NOT A DIRECTORY\n');
      return;
    }

    console.log('  ✓ server/ directory exists');

    // Check for required server files
    const serverFiles = [
      { path: 'dist', isDir: true, description: 'Compiled server code' },
      { path: 'package.json', isDir: false, description: 'Server dependencies' },
      { path: 'local.config.json', isDir: false, description: 'Default configuration' },
    ];

    for (const file of serverFiles) {
      const filePath = join(serverPath, file.path);
      if (!existsSync(filePath)) {
        this.warnings.push(`server/${file.path} not found (${file.description})`);
        console.log(`  ⚠ server/${file.path} - MISSING`);
      } else {
        const isDir = statSync(filePath).isDirectory();
        if (file.isDir && !isDir) {
          this.errors.push(`server/${file.path} should be a directory`);
          console.log(`  ✗ server/${file.path} - NOT A DIRECTORY`);
        } else if (!file.isDir && isDir) {
          this.errors.push(`server/${file.path} should be a file`);
          console.log(`  ✗ server/${file.path} - NOT A FILE`);
        } else {
          console.log(`  ✓ server/${file.path}`);
        }
      }
    }

    console.log();
  }
}

/**
 * Main execution
 */
function main() {
  const args = process.argv.slice(2);
  const powerPath = args[0] || '.';

  const validator = new PowerValidator(powerPath);
  const result = validator.validate();

  // Print summary
  console.log('='.repeat(60));
  console.log('VALIDATION SUMMARY');
  console.log('='.repeat(60));

  if (result.errors.length > 0) {
    console.log(`\n❌ FAILED - ${result.errors.length} error(s) found:\n`);
    result.errors.forEach((error, i) => {
      console.log(`${i + 1}. ${error}`);
    });
  } else {
    console.log('\n✅ PASSED - All required checks passed');
  }

  if (result.warnings.length > 0) {
    console.log(`\n⚠️  ${result.warnings.length} warning(s):\n`);
    result.warnings.forEach((warning, i) => {
      console.log(`${i + 1}. ${warning}`);
    });
  }

  console.log();

  // Exit with appropriate code
  process.exit(result.valid ? 0 : 1);
}

// Export for testing
export { PowerValidator, PowerManifestSchema };

// Run if executed directly (ES module check)
const isMainModule = import.meta.url === `file://${process.argv[1]}`;
if (isMainModule) {
  main();
}
