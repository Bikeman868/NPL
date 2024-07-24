# NPL Formatter

This is a shared library for formatting NPL source code. 

Documentation on the NPL language, framework and supporting tools can be found in [the GitHub repo](https://github.com/Bikeman868/NPL).

## Using the formatter

The formatter is in `./src/formatter/Formatter.ts` and implements `./src/interfaces/IFormatter.ts`.

Add a dependency on the formatter package with:

```shell
npm install npl-syntax
npm install npl-formatter
```

To format some source code simply:

```typescript
import { parse } from 'npl-syntax';
import { Formatter } from 'npl-formatter';

const tokens = parse(sourceCode);
const formatter = new Formatter();
const formattedCode = formatter.format(tokens);
```

## Local Development

You will need to install NodeJS 16+.

Open the `formatter` directory in VSCode otherwise you will not be able to run unit tests by clicking in the margins.
At the time of writing, Vitest does not properly support monorepos.

You might want to consider using the `npm link` command to symbolically link the parser package to the
formatter folder. To do this:

```shell
cd ./syntax
npm link
cd ../formatter
npm link npl-syntax
```

After doing this, any changes to the parser will be used immediately in the formatter without having to 
publish new versions of the parser each time. Note that running `npm install` will remove the symbolic
link, and this is part of the `npm run build` command. This ensures that build then publish will always
publish using the published versions of dependent packages.

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

I also found that Vitest doesn't like monorepos. You can work around this by opening the './formatter'
directory in VSCode rather than opening the monorepo root.

### Checking in

Format the code:

```shell
npm run format
```

Submit a pull request.
