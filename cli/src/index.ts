import { CommandContext } from '#interfaces/CommandContext.js';
import { ICommandOutput } from '#interfaces/ICommandOutput.js';
import { ICommand } from '#interfaces/ICommand.js';
import { ConsoleCommandOutput } from './ConsoleCommandOutput.js';
import { HelpCommand } from '#commands/help/HelpCommand.js';
import { CheckCommand } from '#commands/check/CheckCommand.js';

const commands: Map<string, ICommand> = new Map();
const helpCommand = new HelpCommand(commands);

commands.set('help', helpCommand);
commands.set('check', new CheckCommand());

const commandName = process.argv[2] || 'help';
const command: ICommand = commands.get(commandName) || helpCommand;

const options = new Map();
const output: ICommandOutput = new ConsoleCommandOutput();

const context: CommandContext = { commandName, options, output };
command.execute(context);
