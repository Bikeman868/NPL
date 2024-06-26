import { readFileSync } from 'node:fs';
import * as fs from 'node:fs';
import * as path from 'node:path';

import { IContext } from '#interfaces/IContext.js';
import { SyntaxGraph } from '#interfaces/SyntaxGraph.js';

import { Parser } from '#parser/Parser.js';
import { Context } from '#parser/Context.js';
import { ParsableString } from '#parser/ParsableString.js';
import { buildNplSyntaxGraph } from '#parser/buildNplSyntaxGraph.js';

import { TokenPrinter } from './printer/TokenPrinter.js';
import { SyntaxErrorPrinter } from './printer/SyntaxErrorPrinter.js';

// Pass name of NPL source file or a directory path on command line
const source = process.argv[2] || '.';
const fileNames = [source];

function allFilesRecursive(filePath: string, files: string[]) {
    if (fs.statSync(filePath).isDirectory()) {
        for (let filename of fs.readdirSync(filePath)) allFilesRecursive(filePath + path.sep + filename, files);
    } else {
        if (filePath.endsWith('.npl')) files.push(filePath);
    }
}

if (fs.statSync(source).isDirectory()) {
    fileNames.splice(0);
    allFilesRecursive(source, fileNames);
}

// The syntax graph defines the syntax of the NPL language
const nplLanguageSyntax: SyntaxGraph = buildNplSyntaxGraph();

for (let fileName of fileNames) {
    console.log(fileName);

    const sourceFileBytes = readFileSync(fileName);
    const sourceFileText = sourceFileBytes.toString('utf8', 0, sourceFileBytes.length);

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
}
