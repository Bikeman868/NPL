import { CommandContext } from '#interfaces/CommandContext.js';

export interface ICommand {
    execute(context: CommandContext): undefined;
    getDescription(): string;
    getValidOptions(): Map<string, string> | undefined;
    printDocumentation(context: CommandContext): undefined;
}
