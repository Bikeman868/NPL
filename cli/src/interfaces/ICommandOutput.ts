import { Color } from "./Color";

export interface ICommandOutput {
    writeHeading(text: String, headingLevel: number): undefined;
    writeBody(text: String): undefined;
    writeColor(text: String, color: Color): undefined;
}
