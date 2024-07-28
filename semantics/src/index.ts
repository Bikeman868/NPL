import { Context, nplLanguageSyntax, ParsableString, Parser } from 'npl-syntax';

import { readFileSync } from 'node:fs';
import { ArrayTokenStream } from '#analysis/token-streams/ArrayTokenStream.js';
import { ITokenStream } from 'semantics.js';
import { SourceFileModel } from '#model/SourceFileModel.js';
import { ModelPrinter } from '#analysis/ModelPrinter.js';
import { IModelFactory } from '#interfaces/IModelFactory.js';
import { ModelFactory } from '#analysis/ModelFactory.js';

const filenme = process.argv[2] || '../examples/HelloWorld.npl';
const sourceFileBytes: Buffer = readFileSync(filenme);
const sourceFileText: string = sourceFileBytes.toString('utf8', 0, sourceFileBytes.length);

const buffer = new ParsableString(sourceFileText);
const context = new Context(buffer, nplLanguageSyntax);
const parser = new Parser();
const tokens = parser.parse(context);

if (context.syntaxErrors.length) {
    console.log('\nSyntax errors:');
    for (const error of context.syntaxErrors) console.log(`  ${error.message} at L${error.line}:C${error.column}`);
} else {
    /*
    if (tokens.length) {
        console.log('\nParsed tokens:');
        for (const token of tokens) console.log(`  ${token.tokenType} "${token.text.replace('\n', '\\n')}"`);
    }
    */

    const builderContext: IModelFactory = new ModelFactory();
    builderContext.config = {
        mergeApplications: true,
        mergeNamespaces: true,
        mergeNetworks: true,
        mergeSourceFiles: false,
    };

    const tokenStream: ITokenStream = new ArrayTokenStream(filenme, tokens, true);
    const sourceFile: SourceFileModel = builderContext.buildSourceFileModel(tokenStream);

    console.log();
    const printer = new ModelPrinter();
    printer.printSourceFile(sourceFile, 0);
}
