import { CommandContext } from '#interfaces/CommandContext.js';

export interface ICommand {
    execute(context: CommandContext): undefined;
    getName(): string;
    getDescription(): string;
    getExample(): string;
    getValidOptions(): Map<string, string>;
    printDocumentation(context: CommandContext): undefined;
}
