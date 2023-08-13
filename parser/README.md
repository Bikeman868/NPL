# NPL Parser

This is a shared library for parsing NPL source files. It is used by many development tools including:

- The NPL compiler
- Code formatters
- Code linters
- Static analysis tooling
- Monitoring tools
- Runtime visualization of execution flow

This library includes a very basic printer that will parse a the source file and pretty print the tokens. You can run it after compiling with `node dist <filename>.npl`. This repo contains a couple of sample NPL single source file applications that you can test with.

## Using the parser

The parser is in `./src/parser/Parser.ts` and implements `./src/interfaces/IParser.ts`.

If you just want to tokenize a source file:

```typescript
const buffer = new ParsableString(sourceFileText);
const context = new Context(buffer);
const parser = new Parser();
const tokens = parser.parse(context);
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

You will need to install NodeJS 16+

### First time build

```shell
npm install
npm run build
node dist HelloWorld.npl
```

See package.json for other run commands.

### Unit tests

Tests are using Vitest. You can watch for changes in the tests and re-run with

```shell
npm test
```

You can also run or debug tests by clicking in the margin if you install the Vitest VSCode extension.

### Checking in

Format the code:

```shell
npm run format
```
