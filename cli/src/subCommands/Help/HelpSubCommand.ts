import { CommandContext } from "#interfaces/CommandContext.js";
import { ISubCommand } from "#interfaces/ISubCommand.js";

export class HelpSubCommand implements ISubCommand {
    execute(context: CommandContext): undefined {
        context.output.writeHeading('NPL Help Text', 1);
    }
}