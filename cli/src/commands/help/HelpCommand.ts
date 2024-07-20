import { CommandContext } from '#interfaces/CommandContext.js';
import { ICommand } from '#interfaces/ICommand.js';
import { buildInfo } from '../../buildInfo.js';

export class HelpCommand implements ICommand {
    private commands: Map<string, ICommand>;

    constructor(commands: Map<string, ICommand>) {
        this.commands = commands;
    }

    execute(context: CommandContext): undefined {
        context.output.writeHeading('NPL CLI v' + buildInfo.version + ' (' + buildInfo.date + ')', 1);
        context.output.writeBodyLine('Run the NPL CLI from the command line using the following syntax:');
        context.output.writeBodyLine('');
        context.output.writeBodyLine('\tnpl <command> <param> ... <param> -<opt> ... -<opt>');
        context.output.writeBodyLine('');

        const option = context.options.get('');
        if (option && option.arguments && option.arguments.length > 0) {
            const command = this.commands.get(option.arguments[0])
            if (!command) throw Error(`There is no "${option.arguments[0]}" command. Run "npl help" for a list of available commands.`);

            context.output.writeBodyLine('For example:');
            context.output.writeBodyLine('');
            context.output.writeBodyLine(`\t${command.getExample()}`);

            context.output.writeHeading(`The ${command.getName()} command`, 2);
            context.output.writeBodyLine(`${command.getDescription()}`);

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
                    context.output.writeBodyLine(`\t${param}${spaces}${validOptions.get(param)}`);
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
                    context.output.writeBodyLine(`\t${opt}${spaces}${validOptions.get(opt)}`);
                }
            }

            context.output.writeBodyLine('');
            command.printDocumentation(context);
        } else {
            context.output.writeBodyLine('For example:');
            context.output.writeBodyLine('');
            context.output.writeBodyLine(`\t${this.getExample()}`);

            let longestCommand = 0;
            for (const [commandName, command] of this.commands.entries()) {
                if (commandName.length > longestCommand) longestCommand = commandName.length;
            }

            context.output.writeHeading('Available commands', 3);
            for (const [commandName, command] of this.commands.entries()) {
                const spaces = ' '.repeat(longestCommand - commandName.length + 1);
                context.output.writeBodyLine(`\t${commandName}${spaces}${command.getDescription()}`);
            }

            context.output.writeBodyLine(``);
            context.output.writeBodyLine(`For help with a specific command, run "npl help <command>".`);
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
        opts.set('[command]', 'Prints documentation for the specified command, for example "npl help run"');
        return opts;
    }

    printDocumentation(context: CommandContext): undefined {
        context.output.writeBodyLine('Displays documentation on the NPL CLI.');
    }
}
