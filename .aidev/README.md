# Automated contributions

This directory configures the automated development platform that contributes to this
repository. This note says which branches it uses here and how its work reaches the
project's main line.

## Branches

- `aidev/integration` — the integration branch. Automated work lands here and nowhere else.
- `main` — the project's main line; reached from `aidev/integration` only by merge request (`aidev handoff`, a linear one-commit-per-change copy on `aidev/handoff`, since `main` is fast-forward only). Merge it **keeping the source branch**: `aidev/integration` is protected for that reason.
- `ai/*` — one branch per task, created and deleted by the platform. Do not commit to them.
- `session/*` — a session's accumulated work, landed on the integration branch as a batch.

## How work reaches the main line

Task and session branches never reach `aidev/integration` through merge requests; the platform
lands them after its own verification. `aidev/integration` reaches `main` by this project's
usual process, merge requests included — the platform never merges into any other branch.

CI (`.gitlab-ci.yml`) runs one `typecheck` job on ccc's `node-test-tools` image: the frozen
install of ccc's npm templates (`.npm_based_job_base`) and `tsc --noEmit` over every snippet. It
skips `ai/*` and `session/*` branches, and pushes to `aidev/integration`.

## Suites run before work lands

Declared in `.aidev/project.yaml` under `verification`, all through `.aidev/run-checks.sh`,
which writes `test-results/<slot>/junit.xml` (one case per step, the step's log as the
failure body). Every run first installs dependencies offline from the lockfile
(`.aidev/pnpm-deps.sh`), one case `install`; the slots name the steps after it:

- `quick` — typecheck build
- `full` — typecheck build
- `baseline` — typecheck build
- `canary` — typecheck build
- `static` — typecheck
- `coverage` — typecheck build
- `system` — build

These are the snippets hive/workerbee-doc includes. Steps: `typecheck` is `tsc --noEmit` over
`src/` (tsconfig.json); `build` is `pnpm run build` (`tsc`, emitting into `dist/`; every `*.js`
is gitignored). The repository has **no tests**: every slot is install + type check + build
(`static` the type check only, `system` the build only), so the slots necessarily repeat that
evidence. There is no coverage tooling: `coverage` runs the type check and the build.

The snippets are not run: each `test-*` script of package.json
(`scripts/build-and-test.sh` + `scripts/runner.js`) starts a WorkerBee bot that follows live
blocks from a Hive API node, and the suites run with no network.

## Test runtime

`.aidev/runtime/Dockerfile` builds on common-ci-configuration's `node-test-tools:develop` (Node
and pnpm come from there; this repository pins no Node of its own in it) and adds a pnpm store
filled from `pnpm-lock.yaml` by `pnpm fetch`. Rebuild and re-pin it with
`.aidev/runtime/build.sh --push` when the Dockerfile or the files it copies change (ccc's catalogs
too: `pnpm-workspace.yaml` links into the submodule), or to follow a new `node-test-tools:develop`, and put the printed `repo@sha256:…` into `environment.image`.

## Known state at onboarding (2026-10-29)

- `install`, `typecheck` and `build` pass offline (all 35 snippets compile with TypeScript
  5.7.3 against wax / workerbee 1.27.12-rc1).
- Since issue #1 the dependencies come from common-ci-configuration's pnpm catalogs
  (`catalog:hiveio-toolset`, `catalog:typescript-toolset`): `pnpm-workspace.yaml` and `.npmrc`
  are symlinks into the `npm-common-config` submodule (ccc `develop`), which a checkout must
  initialise before a run (`.aidev/pnpm-deps.sh` refuses otherwise).
  `@hiveio/wax-api-balance-tracker`, which no ccc catalog has, is pinned in `package.json`.
  The snippets follow the wax 1.28.8 / workerbee 1.28.4 API and compile with TypeScript 6.0.3.
