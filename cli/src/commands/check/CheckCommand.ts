import { CommandContext } from '#interfaces/CommandContext.js';
import { ICommand } from '#interfaces/ICommand.js';

export class CheckCommand implements ICommand {
    constructor() {}

    execute(context: CommandContext): undefined {}

    getDescription(): string {
        return 'Syntax checks npl source code';
    }

    getValidOptions(): Map<string, string> | undefined {
        const opts: Map<string, string> = new Map();
        opts.set('-s[trict]', 'Treats all warnings as errors');
        opts.set('-c[ontinue]', 'Continues parsing the source file after the first syntax error');
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
