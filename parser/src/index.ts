import { readFileSync } from 'node:fs';

import { IContext } from '#interfaces/IContext.js';
import { SyntaxGraph } from '#interfaces/SyntaxGraph.js';

import { Parser } from '#parser/Parser.js';
import { Context } from '#parser/Context.js';
import { ParsableString } from '#parser/ParsableString.js';
import { buildNplSyntaxGraph } from '#parser/graphs/buildNplSyntaxGraph.js';

import { TokenPrinter } from './printer/TokenPrinter.js';
import { SyntaxErrorPrinter } from './printer/SyntaxErrorPrinter.js';

// Pass name of NPL source file on command line
const sourceFileBytes = readFileSync(process.argv[2]);
const sourceFileText = sourceFileBytes.toString('utf8', 0, sourceFileBytes.length);

// The syntax graph defines the syntax of the NPL language
const nplLanguageSyntax: SyntaxGraph = buildNplSyntaxGraph();

// The parser requires parsable text
const buffer = new ParsableString(sourceFileText);
const context = new Context(buffer, nplLanguageSyntax);
context.debugLogging = (context: IContext) => false;
context.traceLogging = (context: IContext) => false;

// Tokenise the source file
const parser = new Parser();
const tokens = parser.parse(context);

if (context.syntaxErrors.length > 0) {
    const printer = new SyntaxErrorPrinter();
    printer.includeConsoleColors = true;
    printer.print(sourceFileText, context.syntaxErrors);
} else {
    // Pretty print the code
    const printer = new TokenPrinter(tokens);
    printer.includeConsoleColors = true;
    printer.print();
}
