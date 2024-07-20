import { CommandContext } from '#interfaces/CommandContext.js';
import { ICommand } from '#interfaces/ICommand.js';
import { format } from 'npl-formatter';

export class FormatCommand implements ICommand {
    constructor() {}

    execute(context: CommandContext): undefined {
        const formatted = format('using someNamespace');
        context.output.writeBody(formatted);
    }

    getName(): string {
        return 'format';
    }

    getDescription(): string {
        return 'Parses NPL source code and outputs a version with standard formatting';
    }

    getExample(): string {
        return 'npl format ./src -replace';
    }

    getValidOptions(): Map<string, string> {
        const opts: Map<string, string> = new Map();
        opts.set('<file|dir>', 'The name of the source file of directory path to the source files to format.');
        opts.set('-o[utput] <file|dir>', 'Outputs formatted source code to a file or directory instead of stdout. Can be used to overwrite original source files.');
        opts.set('-r[eplace]', 'Overwrites the original source file with the formatted version.');
        opts.set('-c[olor]', 'Includes console control codes that cause the text to be syntax color highlighted when printed to the console window.');
        return opts;
    }

    printDocumentation(context: CommandContext): undefined {
    }
}
