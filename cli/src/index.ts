import { CommandContext } from '#interfaces/CommandContext.js';
import { ICommandOutput } from '#interfaces/ICommandOutput.js';
import { ICommand } from '#interfaces/ICommand.js';
import { ConsoleCommandOutput } from './ConsoleCommandOutput.js';
import { HelpCommand } from '#commands/help/HelpCommand.js';
import { CheckCommand } from '#commands/check/CheckCommand.js';
import { Option } from '#interfaces/Option.js';
import { CompileCommand } from '#commands/compile/CompileCommand.js';
import { RunCommand } from '#commands/run/RunCommand.js';

const commands: Map<string, ICommand> = new Map();
const helpCommand = new HelpCommand(commands);

commands.set('help', helpCommand);
commands.set('check', new CheckCommand());

// TODO: Other CLI commands
// commands.set('compile', new CompileCommand());
// commands.set('debug', new DebugCommand());
// commands.set('run', new RunCommand());
// commands.set('format', new FormatCommand());

const commandName = process.argv[2] || 'help';
const command: ICommand = commands.get(commandName) || helpCommand;
const validOptions = [...command.getValidOptions().keys()].map(k => k.replace(/[\[\]]+/g, ''));
const options: Map<string, Option> = new Map();

function addOption(name: string, definition: string): Option {
    const option = { 
        name,
        definition,
        arguments: []
    }
    options.set(option.name, option);
    return option;
}

let option: Option | undefined = undefined;

for (let i = 3; i < process.argv.length; i++) {
    const argv = process.argv[i];
    if (argv.startsWith('-')) {
        option = undefined;
        for (let validOption of validOptions) {
            const indexOfSpace = validOption.indexOf(' ');
            const optionName = indexOfSpace < 0 ? validOption : validOption.substring(0, indexOfSpace);
            if (validOption.startsWith(argv)) {
                option = addOption(optionName, validOption);
                break;
            }
        }
        if (!option) {
            throw Error(`"${argv}" is not a valid option for the "${command.getName()}" command, run "npl help ${command.getName()}" for more information`);
        }
    } else {
        if (!option) {
            for (let validOption of validOptions) {
                if (!validOption.startsWith('-')) {
                    option = addOption('', validOption);
                    break;
                }
            }
        }
        if (!option) {
            throw Error(`The "${command.getName()}" command does not take parameters, run "npl help ${command.getName()}" for more information`);
        }
        option.arguments.push(argv)
    }
}

let echo = `${command.getName()}`;

for (const [name, option] of options.entries()) {
    const params = option.definition.split(' ').filter(o => !o.startsWith('-'));
    const maximumParameterCount = params.length;
    const requiredArgumentCount = params.filter(p => p.startsWith('<')).length;
    if (option.arguments.length < requiredArgumentCount)
        console.error(`The "${name}" option requires ${requiredArgumentCount} arguments but ${option.arguments.length} were provided.`);
    if (option.arguments.length > maximumParameterCount)
        console.error(`The "${name}" option takes a maximum of ${maximumParameterCount} arguments but ${option.arguments.length} were provided.`);
    if (option.name) echo += ' ' + option.name;
    if (option.arguments.length > 0) echo += ' ' + option.arguments.join(' ');
}

if (!options.get('')) {
    for (let validOption of validOptions) {
        if (validOption.startsWith('<')) {
            console.error(`The "${command.getName()}" command requires parameters, run "npl help ${command.getName()}" for more information.`);
            process.exit();
        }
    }
}

console.log(echo);
console.log();

const output: ICommandOutput = new ConsoleCommandOutput();

const context: CommandContext = { commandName, options, output };
command.execute(context);
