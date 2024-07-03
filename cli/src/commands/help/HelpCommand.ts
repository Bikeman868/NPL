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
        context.output.writeBody('\tnpl <command> <param> ... <param> -<opt> ... -<opt>');
        context.output.writeBody('');

        const option = context.options.get('');
        if (option && option.arguments && option.arguments.length > 0) {
            const command = this.commands.get(option.arguments[0])
            if (!command) throw Error(`There is no "${option.arguments[0]}" command. Run "npl help" for a list of available commands.`);

            context.output.writeBody('For example:');
            context.output.writeBody('');
            context.output.writeBody(`\t${command.getExample()}`);

            context.output.writeHeading(`The ${command.getName()} command`, 2);
            context.output.writeBody(`${command.getDescription()}`);

            const validOptions = command.getValidOptions();
            const params = [...validOptions.keys()].filter(k => !k.startsWith('-'));
            const opts = [...validOptions.keys()].filter(k => k.startsWith('-'));

            if (params.length > 0) {
                context.output.writeHeading('Parameters', 3);
                let longestParam = 0;
                for (const param of params) {
                    if (param.length > longestParam) longestParam = param.length;
                }
                for (const param of params) {
                    const spaces = ' '.repeat(longestParam - param.length + 1);
                    context.output.writeBody(`\t${param}${spaces}${validOptions.get(param)}`);
                }
            }

            if (opts.length > 0) {
                context.output.writeHeading('Available options', 3);
                let longestOpt = 0;
                for (const opt of opts) {
                    if (opt.length > longestOpt) longestOpt = opt.length;
                }
                for (const opt of opts) {
                    const spaces = ' '.repeat(longestOpt - opt.length + 1);
                    context.output.writeBody(`\t${opt}${spaces}${validOptions.get(opt)}`);
                }
            }

            context.output.writeBody('');
            command.printDocumentation(context);
        } else {
            context.output.writeBody('For example:');
            context.output.writeBody('');
            context.output.writeBody(`\t${this.getExample()}`);

            let longestCommand = 0;
            for (const [commandName, command] of this.commands.entries()) {
                if (commandName.length > longestCommand) longestCommand = commandName.length;
            }

            context.output.writeHeading('Available commands', 3);
            for (const [commandName, command] of this.commands.entries()) {
                const spaces = ' '.repeat(longestCommand - commandName.length + 1);
                context.output.writeBody(`\t${commandName}${spaces}${command.getDescription()}`);
            }

            context.output.writeBody(``);
            context.output.writeBody(`For help with a specific command, run "npl help <command>".`);
        }
    }

    getName(): string {
        return 'help';
    }

    getDescription(): string {
        return 'Displays this help information';
    }

    getExample(): string {
        return 'npl help run';
    }

    getValidOptions(): Map<string, string> {
        const opts: Map<string, string> = new Map();
        opts.set('<command>', 'Prints documentation for the specified command, for example "npl help run"');
        return opts;
    }

    printDocumentation(context: CommandContext): undefined {
        context.output.writeBody('Displays documentation on the NPL CLI.');
    }
}
