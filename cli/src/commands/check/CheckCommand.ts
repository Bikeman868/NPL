import * as fs from 'node:fs';
import * as path from 'node:path';
import { readFileSync } from 'node:fs';
import { CommandContext } from '#interfaces/CommandContext.js';
import { ICommand } from '#interfaces/ICommand.js';
import { ParsableString, Context, Parser, nplLanguageSyntax } from 'npl-parser';
import { SyntaxErrorPrinter } from './SyntaxErrorPrinter.js';

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
        opts.set('-r[ecursive]', 'Recursively enumerates sub-directories if the <filename> param is a directory');
        opts.set('-d[etailed]', 'Prints a few lines of code near each syntax error and the reported error');
        opts.set('-l[ines] <n>', 'Configures how many lines of source code to print for each syntax error, 0 to print the whole source file');
        return opts;
    }

    printDocumentation(context: CommandContext): undefined {
        context.output.writeBodyLine(
            'Only checks that the syntax is valid. The code is not guaranteed to compile if the syntax is valid, for example if your code references a non-existent identifier this is a compiler error but not a syntax error.',
        );
        context.output.writeBodyLine(
            'Use this command as a quick check if a source file is valid npl, or to eliminate syntax issues if you are having problems getting a source file to compile.',
        );
        context.output.writeBodyLine(
            'By default this tool prints out a list of the files that were checked, with an indication of which ones contained syntax errors. To see the errors, check a single file, or pass the -detailed option on the command line',
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

    private checkSourceFile(commandContext: CommandContext, fileName: string, printSource: boolean, linesToPrint: number) {
        const sourceFileBytes = readFileSync(fileName);
        const sourceFileText = sourceFileBytes.toString('utf8', 0, sourceFileBytes.length);
    
        // The parser requires parsable text
        const buffer = new ParsableString(sourceFileText);
        const parserContext = new Context(buffer, nplLanguageSyntax);
    
        // Tokenise the source file
        const startMs = performance.now();
        const parser = new Parser();
        parser.parse(parserContext);
        const elapsedMs = performance.now() - startMs;
    
        // Check for syntax errors
        if (parserContext.syntaxErrors.length > 0) {
            commandContext.output.writeBodyLine(`${fileName} contains ${parserContext.syntaxErrors.length} syntax errors (${elapsedMs.toFixed(1)}ms)`);
            if (printSource) {
                const printer = new SyntaxErrorPrinter(commandContext.output, true, true);
                printer.print(sourceFileText, parserContext.syntaxErrors, linesToPrint);
            }
        } else {
            commandContext.output.writeBody(fileName);
            commandContext.output.writeColor(' OK', 'green');
            commandContext.output.writeBody(` (${elapsedMs.toFixed(1)}ms)`);
            commandContext.output.flushLine();
        }
    }

    execute(commandContext: CommandContext): undefined {
        let source = '.';
        
        const params = commandContext.options.get('');
        if (params && params.arguments && params.arguments.length > 0)
            source = params.arguments[0];

        const outputOption = commandContext.options.get('-output');
        const recursiveOption = commandContext.options.get('-recursive');
        const detailedOption = commandContext.options.get('-detailed');
        const linesOption = commandContext.options.get('-lines');

        const linesToPrint = linesOption ? parseInt(linesOption.arguments[0]) : 5;

        const fileNames = [source];
        if (fs.statSync(source).isDirectory()) {
            fileNames.splice(0);
            if (recursiveOption) {
                this.allFilesRecursive(source, fileNames);
            } else {
                for (const filename of fs.readdirSync(source))
                    if (filename.endsWith('.npl')) 
                        fileNames.push(source + path.sep + filename);
            }
        }

        if (fileNames.length == 0) {
            commandContext.output.writeColor('No NPL source files found', 'red');
        } else if (fileNames.length == 1) {
            this.checkSourceFile(commandContext, fileNames[0], true, linesToPrint)
        } else {
            for (let fileName of fileNames) {
                this.checkSourceFile(commandContext, fileName, !!detailedOption, linesToPrint)
            }
        }
    }
}
