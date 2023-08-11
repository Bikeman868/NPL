import { Parser } from './parser/Parser.js';
import { Context } from './parser/Context.js';
import { ParsableString } from './parser/ParsableString.js';
import { TokenPrinter } from './printer/TokenPrinter.js';
import { readFileSync } from 'node:fs';

// Pass name of NPL source file on command line
const sourceFileBytes = readFileSync(process.argv[2]);
const sourceFileText = sourceFileBytes.toString(
  'utf8',
  0,
  sourceFileBytes.length,
);

// The parser requires parsable text
const buffer = new ParsableString(sourceFileText);
const context = new Context(buffer);
context.debugLogging = false;

// Tokenise the source file
const parser = new Parser();
const tokens = parser.parse(context);

// Pretty print the code
const printer = new TokenPrinter();
printer.print(tokens);
