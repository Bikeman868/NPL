import { CommandContext } from '#interfaces/CommandContext.js';
import { ICommand } from '#interfaces/ICommand.js';

export class RunCommand implements ICommand {
    constructor() {}

    execute(context: CommandContext): undefined {}

    getName(): string {
        return 'run';
    }

    getDescription(): string {
        return 'Compiles npl source code into JavaScript then runs it using NodeJS';
    }

    getExample(): string {
        return 'npl run ./myapp/src -application smokeTest -config ./myapp/config/dev.yaml';
    }

    getValidOptions(): Map<string, string> {
        const opts: Map<string, string> = new Map();
        opts.set('<filename>', 'The name of the source file of directory path to compile and run');
        opts.set('-a[pplication] <name>', 'The name of the startup application');
        opts.set('-c[onfig] <filename>', 'The name of a yaml file that overrides config values in the application');
        return opts;
    }

    printDocumentation(context: CommandContext): undefined {
    }
}
