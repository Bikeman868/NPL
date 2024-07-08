import { CommandContext } from '#interfaces/CommandContext.js';
import { ICommand } from '#interfaces/ICommand.js';

export class CompileCommand implements ICommand {
    constructor() {}

    execute(context: CommandContext): undefined {}

    getName(): string {
        return 'compile';
    }

    getDescription(): string {
        return 'Compiles npl source code into JavaScript';
    }

    getExample(): string {
        return 'npl compile ./myapp/src -application smokeTest';
    }

    getValidOptions(): Map<string, string> {
        const opts: Map<string, string> = new Map();
        opts.set('<filename>', 'The name of the source file of directory path to compile');
        opts.set('-a[pplication] <name>', 'The name of the startup application');
        return opts;
    }

    printDocumentation(context: CommandContext): undefined {
    }
}
