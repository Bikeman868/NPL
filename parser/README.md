# NPL Parser

This is a shared library for parsing NPL source files. It is used by many development tools including:

-   The NPL compiler
-   Code formatters
-   Code linters
-   Static analysis tools
-   Monitoring tools
-   Runtime visualization of execution flow tools

This library includes a very basic printer that will parse a the source file and pretty print the tokens. You can run it after compiling with `node dist <filename>.npl`. This repo contains a couple of sample NPL single source file applications that you can test with.

Documentation on the NPL language, framework and supporting tools can be found in [the GitHub repo](https://github.com/Bikeman868/NPL).

## Using the parser

The parser is in `./src/parser/Parser.ts` and implements `./src/interfaces/IParser.ts`.

Add a dependency on the parser package with:

```shell
npm install npl-parser
```

If you just want to tokenize some source code:

```typescript
import {
    ParsableString,
    Context,
    Parser,
    nplLanguageSyntax
} from 'npl-parser';

// ParsableString implements IParsableString for an in-memory string containing the entire source code to parse.
// You don't have to use the ParsableString class, you can write your own implementation of IParsableString
const buffer = new ParsableString(sourceCode);

// The parser itself is completely stateless. The current state is stored in IContext alowing parsing to be performed
// incrementally. You can implement IContext yourself, and you could even extend the NPL syntax here.
const context = new Context(buffer, nplLanguageSyntax);

// You will want to construct a parser. The parser is stateless and thread safe
const parser = new Parser();

// You can parse the entire source file in one go, and return an array of tokens like this. There are other methods
// of the parser class that allow for partial parsing and incremental parsing
const tokens = parser.parse(context);
```

If you want default behaviors, this can be abbreviated to:
```typescript
import { parse } from 'npl-parser';

const tokens = parse(sourceCode);
```

The `parser.parse()` method takes `IContext` so you can provide your own implementation. The constructor
for `Context` also takes `IParsable` so you can provide your own implementation of that instead.

Instead of `parser.parse()` you can also parse part of a source file using `parseUntil()` and `skipUntil()`
methods, or you can parse one token at a time by repeatedly calling `extractNextToken()`.

When calling `extractNextToken()`, you can pass a context with `isDryRun` set to true, and the next token
will be extracted without modifying the context. The parser itself is stateless, all of the required state
is stored in `IContext`.

If errors are encountered during the parsing operation, you can examine them in `IContext.syntaxErrors`.

## Local Development

You will need to install NodeJS 16+.

Open the `parser` directory in VSCode otherwise you will not be able to run unit tests by clicking in the margins.
At the time of writing, Vitest does not properly support monorepos.

### First time build

```shell
npm install
npm run build
node dist examples/HelloWorld.npl
```

### Subsequent builds

If you did not delete any source files, then you can just recompile the code with:

```shell
npm run compile
node dist examples/HelloWorld.npl
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

I also found that Vitest doesn't like monorepos. You can work around this by opening the './parser'
directory in VSCode rather than opening the monorepo root.

### Checking in

Format the code:

```shell
npm run format
```

Submit a pull request.
