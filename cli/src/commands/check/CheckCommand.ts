import * as fs from 'node:fs';
import * as path from 'node:path';
import { readFileSync } from 'node:fs';
import { CommandContext } from '#interfaces/CommandContext.js';
import { ICommand } from '#interfaces/ICommand.js';
import { ParsableString } from 'npl-parser';

export class CheckCommand implements ICommand {
    constructor() {}

    getName(): string {
        return 'check';
    }

    getDescription(): string {
        return 'Syntax checks npl source code';
    }

    getExample(): string {
        return 'npl check myfile.npl -continue -strict';
    }

    getValidOptions(): Map<string, string> {
        const opts: Map<string, string> = new Map();
        opts.set('[file|dir]', 'The name of the source file of directory path to check. Defaults to "."');
        opts.set('-s[trict]', 'Treats all warnings as errors');
        opts.set('-c[ontinue]', 'Continues parsing the source file after the first syntax error');
        opts.set('-o[utput] <filename>', 'Writes syntax errors to the specified file');
        opts.set('-r[ecursive]', 'Recursively enumerates sub-directories if the <filename> param is a directory');
        return opts;
    }

    printDocumentation(context: CommandContext): undefined {
        context.output.writeBody(
            'Only checks that the syntax is valid. The code is not guaranteed to compile if the syntax is valid, for example if your code references a non-existent identifier this is a compiler error but not a syntax error.',
        );
        context.output.writeBody(
            'Use this command as a quick check if a source file is valid npl, or to eliminate syntax issues if you are having problems getting a source file to compile.',
        );
    }

    private allFilesRecursive(filePath: string, files: string[]) {
        if (fs.statSync(filePath).isDirectory()) {
            for (const filename of fs.readdirSync(filePath))
                this.allFilesRecursive(filePath + path.sep + filename, files);
        } else {
            if (filePath.endsWith('.npl')) files.push(filePath);
        }
    }

    private checkSourceFile(context: CommandContext, fileName: string) {
        context.output.writeBody(fileName);
        const sourceFileBytes = readFileSync(fileName);
        const sourceFileText = sourceFileBytes.toString('utf8', 0, sourceFileBytes.length);
    
        // The parser requires parsable text
        const buffer = new ParsableString(sourceFileText);
        const parserContext = new Context(buffer, nplLanguageSyntax);
        context.debugLogging = (parserContext: IContext) => false; //context.position.line > 401;
    
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

    execute(context: CommandContext): undefined {
        let source = '.';
        
        const params = context.options.get('');
        if (params && params.arguments && params.arguments.length > 0)
            source = params.arguments[0];

        const fileNames = [source];
        if (fs.statSync(source).isDirectory()) {
            fileNames.splice(0);
            if (context.options.get('-recursive')) {
                this.allFilesRecursive(source, fileNames);
            } else {
                for (const filename of fs.readdirSync(source))
                    if (filename.endsWith('.npl')) 
                        fileNames.push(source + path.sep + filename);
            }
        }

        for (let fileName of fileNames) {
            this.checkSourceFile(context, fileName)
        }
    }
}
