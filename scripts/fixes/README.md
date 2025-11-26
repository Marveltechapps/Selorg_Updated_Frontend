# Fix Scripts

This directory contains utility scripts that fix common issues that may occur during development or after dependency updates.

## Scripts

### SVG Fix Scripts

- **fix-svg.sh** - Initial SVG import fix script
- **fix-svg-complete.sh** - Complete SVG fix with all necessary changes
- **fix-svg-complete-final.sh** - Final version of SVG fixes
- **fix-svg-complete-automated.sh** - Automated SVG fix script
- **fix-svg-complete-final-automated.sh** - Final automated SVG fix

**Purpose**: Fixes SVG import issues with react-native-svg. These were created during migration to ensure SVG assets load correctly.

**Note**: Most of these fixes should now be permanent in the codebase. If you encounter SVG import errors, check:
1. `react-native-svg` is installed
2. `react-native-svg-transformer` is configured in `metro.config.js`
3. SVG imports use proper syntax: `import Icon from './icon.svg'`

### React Native Maps Fix

- **fix-rnmaps-error.sh** - Fixes react-native-maps configuration issues
- **fix-maps-ios.sh** - Fixes iOS-specific maps setup

**Purpose**: Resolves issues with react-native-maps setup, particularly on iOS.

**When to use**: If you encounter errors like:
- "RNMaps module not found"
- Maps not displaying on iOS
- Google Maps API key issues

### React Native Screens Fix

- **fix-react-native-screens.sh** - Fixes react-native-screens configuration

**Purpose**: Resolves issues with react-native-screens, which is required for React Navigation.

**When to use**: If navigation screens don't render properly or you see errors about react-native-screens.

### NetInfo Fix

- **fix-netinfo.sh** - Fixes @react-native-community/netinfo setup

**Purpose**: Resolves network connectivity detection issues.

**When to use**: If network status detection isn't working properly.

## Usage

These scripts are typically run once during setup or after dependency updates. Most fixes should be permanent in the codebase, so you shouldn't need to run these regularly.

To run a script:
```bash
./scripts/fixes/fix-script-name.sh
```

## Maintenance

If you find that these scripts need to be run repeatedly, consider:
1. Updating the permanent configuration files to include the fixes
2. Documenting the fix in the main README
3. Adding the fix to the setup process

## Deprecated Scripts

Some scripts may become deprecated as the codebase matures and fixes are permanently applied. Scripts that are no longer needed will be moved to a `deprecated/` subdirectory.

