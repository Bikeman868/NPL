import { Color } from '#interfaces/Color.js';

export interface ICommandOutput {
    writeHeading(text: String, headingLevel: number): undefined;
    writeBodyLine(text: String): undefined;
    writeBody(text: String): undefined;
    writeColor(text: String, color: Color): undefined;
    flushLine(): undefined;
}
