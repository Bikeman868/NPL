import { CommandContext } from '#interfaces/CommandContext.js';
import { ICommand } from '#interfaces/ICommand.js';

export class CheckCommand implements ICommand {
    constructor() {}

    execute(context: CommandContext): undefined {}

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
        opts.set('<filename>', 'The name of the source file of directory path to check');
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
}
