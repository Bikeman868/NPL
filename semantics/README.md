# NPL Semantics

This is a shared library for converting a stream of token from a parser into the semantic structure of an NPL program. It is used by many development tools including:

-   The NPL compiler
-   Code formatters
-   Code linters
-   Static analysis tools
-   Monitoring tools
-   Runtime visualization of execution flow tools

Documentation on the NPL language, framework and supporting tools can be found in [the GitHub repo](https://github.com/Bikeman868/NPL).

## Exports

Exports from this package are defined in `./semantics/src/semantics.ts` and comprise:
*
*


## Local Development

You will need to install NodeJS 16+.

Open the `semantics` directory in VSCode otherwise you will not be able to run unit tests by clicking in the margins.
At the time of writing, Vitest does not properly support monorepos.

### First time build

```shell
npm install
npm run build
node dist ../examples/HelloWorld.npl
```

### Subsequent builds

If you did not delete any source files, then you can just recompile the code with:

```shell
npm run compile
node dist ../examples/HelloWorld.npl
```

See `package.json` for other run commands.

### Unit tests

Tests are using Vitest. You can watch for changes and re-run tests continuously with

```shell
npm test
```

You can also run or debug tests by clicking in the margin if you install the Vitest VSCode extension.

For this to work, make sure to install NodeJS in the OS that VSCode is running in, i.e. don't use WSL
and install Node into a Linux environment, this won't work for VSCode plugins that execute JavaScript.

I also found that Vitest doesn't like monorepos. You can work around this by opening the './syntax'
directory in VSCode rather than opening the monorepo root.

### Checking in

Format the code:

```shell
npm run format
```

Submit a pull request.
