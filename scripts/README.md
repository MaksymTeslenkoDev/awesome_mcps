# Release Scripts

## OICP Power Release

Creates a versioned tarball of the `oicp-power` directory for distribution.

### Usage

```bash
yarn release:oicp-power
```

### What it does

- Reads version from `oicp-power/power.json`
- Creates `oicp-power-{version}.tar.gz` in the root directory
- Excludes:
  - `node_modules/`
  - `dist/`
  - `.DS_Store`
  - `*.log`
  - `.git/`

### Output

The script creates a file named `oicp-power-{version}.tar.gz` (e.g., `oicp-power-1.0.0.tar.gz`) in the project root.
