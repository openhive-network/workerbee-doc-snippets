# WorkerBee Documentation Snippets

## Project Overview

Code snippets demonstrating WorkerBee API usage for Hive blockchain observation. These snippets serve as documentation examples for developers learning the WorkerBee framework.

WorkerBee is a blockchain observation framework that provides filters (event triggers) and providers (data enrichment) for monitoring Hive blockchain activity.

## Tech Stack

- **Language:** TypeScript 5.7.3
- **Runtime:** Node.js ^20.11 || >= 21.2
- **Module System:** ES Modules (Node16 resolution)
- **Package Manager:** pnpm@10.0.0
- **Target:** ES2022

**Key Dependencies:**
- `@hiveio/workerbee` - Core observation framework
- `@hiveio/wax` - Hive chain wrapper
- `@hiveio/beekeeper` - Data access layer
- `@hiveio/wax-api-balance-tracker` - Financial data provider

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

import { WorkerBee } from "@hiveio/workerbee";
import { SomeClassifier } from "@hiveio/workerbee/classifiers";

const bot = new WorkerBee();
await bot.start();

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
const chain = await createHiveChain().extend(BalanceTrackerApi);
const bot = new WorkerBee({ explicitChain: chain });
```

### Naming Conventions

- Files named after feature: `onBlock.ts`, `provideAccounts.ts`
- Categories use emoji prefixes in JSDoc
- Test accounts: `guest4test`, `guest4test1`

## CI/CD Notes

No CI/CD configuration present in repository. This is a documentation snippets project - snippets are tested locally via npm scripts.

Build process (from `build-and-test.sh`):
1. Remove old compiled `.js` files
2. Compile TypeScript with decorators support
3. Copy runner script
4. Execute compiled JavaScript
