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

-   Interfaces that you can implement in your own code
-   Errors that are thrown by the package
-   A static analysis model of an NPL application
-   Implementations of ITokenStream
-   Builders for each type in the static analysis model
-   An implementation of IModelBuilderContext called ModelBuilderContext

## Using the package

To install the package into your application:

```shell
npm install npl-semantics
```

To analyse an array of `tokens` parsed from a source file and build a model of the application:

```typescript
import {
    IModelBuilderFactory,
    ITokenStream,
    SourceFileModel,
    ModelBuilderFactory,
    ArrayTokenStream,
} from npl-semantics

const builderFactory: IModelBuilderFactory = new ModelBuilderFactory();
const tokenStream: ITokenStream = new ArrayTokenStream(tokens, true);
const sourceFile: SourceFileModel = builderFactory.buildSourceFileModel(tokenStream);
```

You can customize this process in the following ways:

-   The `ArrayTokenStream` constructor takes a boolean that indicates whether comments should be preserved or not. If you are writing a compiler or static analysis tool, you probably don't need the comments, but if you are writng a reformatting tool, you definitely do.
-   `IModelBuilderFactory` defines a `config` property that controls merging. For example if the source code contains multiple definitions for the same network you can choose to combine all of the elements of the network into one big network model, or leave them separate, as they were in the source code. Applications that reformat the code likely
    do not want to merge models, whereas applications that perform static analysis will probably find it convenient to
    merge partial model definitions together.

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
