import { CommandContext } from '#interfaces/CommandContext.js';
import { ICommand } from '#interfaces/ICommand.js';

export class HelpCommand implements ICommand {
    private commands: Map<string, ICommand>;

    constructor(commands: Map<string, ICommand>) {
        this.commands = commands;
    }

    execute(context: CommandContext): undefined {
        context.output.writeHeading('How to use NPL CLI', 1);
        context.output.writeBody('Run the NPL CLI from the command line using the following syntax:');
        context.output.writeBody('');
        context.output.writeBody('\tnpl <command> -<opt> ... -<opt>');
        context.output.writeBody('');
        context.output.writeBody(
            'Commands are explained in sub-headings below, and options are specific to each command.',
        );

        let longestCommand = 0;
        for (const [commandName, command] of this.commands.entries()) {
            if (commandName.length > longestCommand) longestCommand = commandName.length;
        }

        context.output.writeHeading('Available commands', 3);
        for (const [commandName, command] of this.commands.entries()) {
            const spaces = ' '.repeat(longestCommand - commandName.length + 1);
            context.output.writeBody(`\t${commandName}${spaces}${command.getDescription()}`);
        }

        for (const [commandName, command] of this.commands.entries()) {
            context.output.writeHeading(`The ${commandName} command`, 2);

            const opts = command.getValidOptions();
            if (opts) {
                let longestOpt = 0;
                for (const [opt, description] of opts.entries()) {
                    if (opt.length > longestOpt) longestOpt = opt.length;
                }
                context.output.writeHeading('Available options', 3);
                for (const [opt, description] of opts.entries()) {
                    const spaces = ' '.repeat(longestOpt - opt.length + 1);
                    context.output.writeBody(`\t${opt}${spaces}${description}`);
                }
            }

            context.output.writeBody('');
            command.printDocumentation(context);
        }
    }

    getDescription(): string {
        return 'Displays this help information';
    }

    getValidOptions(): Map<string, string> | undefined {
        const opts: Map<string, string> = new Map();
        opts.set('<command>>', 'Prints documentation for the specified command');
        return opts;
    }

    printDocumentation(context: CommandContext): undefined {
        context.output.writeBody('Displays a list of valid commands and available options for each command.');
    }
}
