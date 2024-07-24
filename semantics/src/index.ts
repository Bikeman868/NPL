import { 
    Context, 
    nplLanguageSyntax, 
    ParsableString,
    Parser,
} from 'npl-syntax';

import { readFileSync } from 'node:fs';
import { ArrayTokenStream } from '#analysis/ArrayTokenStream.js';
import { ITokenStream } from 'semantics.js';
import { SourceFileModel } from '#model/SourceFileModel.js';
import { ModelPrinter } from '#analysis/ModelPrinter.js';
import { IModelBuilderContext } from '#analysis/IModelBuilderContext.js';
import { ModelBuilderContext } from '#analysis/ModelBuilderContext.js';

//  const sourceFileBytes: Buffer = readFileSync('../examples/HelloWorld.npl');
//  const sourceFileText: string = sourceFileBytes.toString('utf8', 0, sourceFileBytes.length);

const sourceFileText = `using npl.io // Access to console
// Application namespace
namespace app using npl.scheduler
namespace app {
    using npl.db
}`

const buffer = new ParsableString(sourceFileText);
const context = new Context(buffer, nplLanguageSyntax);
const parser = new Parser();
const tokens = parser.parse(context);

if (context.syntaxErrors.length) {
    console.log('\nSyntax errors:')
    for (const error of context.syntaxErrors)
        console.log(`  ${error.message}`);
}

// if (tokens.length) {
//     console.log('\nParsed tokens:')
//     for (const token of tokens)
//         console.log(`  ${token.tokenType} "${token.text.replace('\n', '\\n')}"`);
// }

const builderContext: IModelBuilderContext = new ModelBuilderContext();
builderContext.config = {
    mergeNamespaces: true,
    mergeNetworks: true,
    mergeSourceFiles: false
}

const tokenStream: ITokenStream = new ArrayTokenStream(tokens, true);
const sourceFile: SourceFileModel = builderContext.buildSourceFileModel(tokenStream);

console.log();
const printer = new ModelPrinter();
printer.printSourceFile(sourceFile, 0)
