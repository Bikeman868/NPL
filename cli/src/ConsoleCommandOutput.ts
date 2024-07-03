import { Color } from "#interfaces/Color.js";
import { ICommandOutput } from "#interfaces/ICommandOutput.js";

export class ConsoleCommandOutput implements ICommandOutput {
    writeHeading(text: String, headingLevel: number): undefined {

    }

    writeBody(text: String): undefined {

    }

    writeColor(text: String, color: Color): undefined {
        
    }
}