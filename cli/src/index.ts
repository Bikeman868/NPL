import { CommandContext } from '#interfaces/CommandContext.js';
import { ICommandOutput } from '#interfaces/ICommandOutput.js';
import { ICommand } from '#interfaces/ICommand.js';
import { ConsoleCommandOutput } from './ConsoleCommandOutput.js';
import { HelpCommand } from '#commands/help/HelpCommand.js';
import { CheckCommand } from '#commands/check/CheckCommand.js';
import { Option } from '#interfaces/Option.js';

const commands: Map<string, ICommand> = new Map();
const helpCommand = new HelpCommand(commands);

commands.set('help', helpCommand);
commands.set('check', new CheckCommand());

const commandName = process.argv[2] || 'help';
const command: ICommand = commands.get(commandName) || helpCommand;
const validOptions = [...command.getValidOptions().keys()].map(k => k.replace(/[\[\]]+/g, ''));

const options: Map<string, Option> = new Map();
let option: Option | undefined = undefined;
for (let i = 3; i < process.argv.length; i++) {
    const argv = process.argv[i];
    if (argv.startsWith('-')) {
        option = undefined;
        for (let validOption of validOptions) {
            if (validOption.startsWith(argv)) {
                option = { 
                    name: validOption,
                    definition: validOption,
                    arguments: []
                }
                options.set(option.name, option);
                break;
            }
        }
        if (!option) {
            throw Error(`"${argv}" is not a valid option for the "${command.getName()}" command, Run "npl help ${command.getName()}" for more information`);
        }
    } else {
        if (!option) {
            for (let validOption of validOptions) {
                if (!validOption.startsWith('-')) {
                    option = { 
                        name: '',
                        definition: validOption, 
                        arguments: [],
                    }
                    options.set(option.name, option);
                    break;
                }
            }
        }
        if (!option) {
            throw Error(`The "${command.getName()}" command does not take parameters, Run "npl help ${command.getName()}" for more information`);
        }
        option.arguments.push(argv)
    }
}

let echo = `${command.getName()}`;
for (const [name, option] of options.entries()) {
    if (option.name) echo += ' ' + option.name;
    if (option.arguments.length > 0) echo += ' ' + option.arguments.join(' ');
}
console.log(echo);
console.log();

const output: ICommandOutput = new ConsoleCommandOutput();

const context: CommandContext = { commandName, options, output };
command.execute(context);
