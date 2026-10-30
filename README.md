# WorkerBee Docs Snippets

Snippets for the WorkerBee Documentation

## TypeScript

### Prepare

```bash
git submodule update --init
pnpm install
```

`pnpm-workspace.yaml` and `.npmrc` link into the `npm-common-config` submodule
(hive/common-ci-configuration), whose pnpm catalogs pin the Hive libraries and TypeScript.

### Run tests

```bash
npm test "file_path"
```

## License

See [LICENSE.md](LICENSE.md)
