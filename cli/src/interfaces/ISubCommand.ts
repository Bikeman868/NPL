import { CommandContext } from "./CommandContext.js";

export interface ISubCommand {
    execute(context: CommandContext): undefined
}
