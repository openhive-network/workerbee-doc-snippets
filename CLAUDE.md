# WorkerBee Documentation Snippets

## Project Overview

Code snippets demonstrating WorkerBee API usage for Hive blockchain observation. These snippets serve as documentation examples for developers learning the WorkerBee framework.

WorkerBee is a blockchain observation framework that provides filters (event triggers) and providers (data enrichment) for monitoring Hive blockchain activity.

## Tech Stack

- **Language:** TypeScript 6.0 (`catalog:typescript-toolset`)
- **Runtime:** Node.js >= 24 (CI: ccc's `node-test-tools` image)
- **Module System:** ES Modules (Node16 resolution)
- **Package Manager:** pnpm@10.33.0 (ccc's `PNPM_VERSION`)
- **Target:** ES2022

**Key Dependencies** (versions from ccc's pnpm catalogs: `pnpm-workspace.yaml` and `.npmrc`
are symlinks into the `npm-common-config` submodule; run `git submodule update --init` first):
- `@hiveio/workerbee` - Core observation framework
- `@hiveio/wax` - Hive chain wrapper
- `@hiveio/beekeeper` - Data access layer
- `@hiveio/wax-api-balance-tracker` - Financial data provider (not in a ccc catalog: pinned in `package.json` to a 1.28.8 build)

## Directory Structure

```
src/typescript/
├── api-reference/
│   ├── filters/        # 25 filter examples (event triggers)
│   ├── providers/      # 7 provider examples (data enrichment)
│   └── custom/         # 3 custom integration examples
scripts/
├── build-and-test.sh   # Build and run script
└── runner.js           # Dynamic JS module loader
```

## Development Commands

```bash
# Install dependencies
pnpm install

# Test a specific snippet
npm run test-api-reference-filters-onBlock
npm run test-api-reference-providers-provideAccounts
npm run test-api-reference-custom-filter

# Build (via test script)
./scripts/build-and-test.sh <path-to-ts-file>
```

All test scripts follow pattern: `test-api-reference-<category>-<name>`

## Key Files

| File | Purpose |
|------|---------|
| `package.json` | Dependencies and 38 test scripts |
| `tsconfig.json` | TypeScript config (ES2022, Node16 modules) |
| `scripts/build-and-test.sh` | Compiles TS and runs with Node |
| `scripts/runner.js` | Dynamic module loader for tests |

## Coding Conventions

### File Structure Pattern

Every snippet file follows this structure:

```typescript
/**
 * @category Category Name
 * @demo Feature Name
 * @description What this demonstrates
 * @param {Type} paramName - Description
 * @returnData Type - What data is returned
 */

import { createHiveChain } from "@hiveio/wax";
import WorkerBee from "@hiveio/workerbee";

const chain = await createHiveChain();
const bot = new WorkerBee(chain);
bot.start();

console.log("Listening for events...");

bot.observe.onFilter([params])
  .subscribe({
    next: (data) => {
      console.log(data);
    },
    error: (error) => {
      console.error(error);
    }
  });
```

### Common Patterns

**Basic Observer:**
```typescript
bot.observe.onFilter([params]).subscribe({ next, error })
```

**Observer with Provider:**
```typescript
bot.observe.onFilter([params])
  .provide<Provider>([params])
  .subscribe({ next, error })
```

**Custom Filter with API:**
```typescript
const extendedChain = (await createHiveChain()).extendRest(WaxExtendedData);
const bot = new WorkerBee(extendedChain);
// call the REST API through extendedChain.restApi (bot.chain carries no REST typing)
```

### Naming Conventions

- Files named after feature: `onBlock.ts`, `provideAccounts.ts`
- Categories use emoji prefixes in JSDoc
- Test accounts: `guest4test`, `guest4test1`

## CI/CD Notes

`.gitlab-ci.yml` runs one `typecheck` job (ccc's `.npm_based_job_base`: frozen install, then
`tsc --noEmit` over `src/`) on ccc's `node-test-tools` image, tagged `public-runner-docker`.
Snippets are run locally via npm scripts (they need a live Hive API node).

Build process (from `build-and-test.sh`):
1. Remove old compiled `.js` files
2. Compile TypeScript with decorators support
3. Copy runner script
4. Execute compiled JavaScript
