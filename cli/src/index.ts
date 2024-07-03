import { CommandContext } from "#interfaces/CommandContext.js";
import { ICommandOutput } from "#interfaces/ICommandOutput.js";
import { ISubCommand } from "#interfaces/ISubCommand.js";
import { ConsoleCommandOutput } from "ConsoleCommandOutput.js";
import { HelpSubCommand } from "subCommands/Help/HelpSubCommand.js";

const helpSubCommand = new HelpSubCommand();
const subCommands: Map<string, ISubCommand> = new Map();

subCommands.set('help', helpSubCommand);

const subCommand = process.argv[2] || 'help';
const command: ISubCommand = subCommands.get(subCommand) || helpSubCommand;

const options = new Map();
const output: ICommandOutput = new ConsoleCommandOutput();

const context: CommandContext = { subCommand, options, output }
command.execute(context);
