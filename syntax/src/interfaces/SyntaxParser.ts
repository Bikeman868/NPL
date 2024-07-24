import { IContext } from "#interfaces/IContext.js";
import { ParseResult } from '#interfaces/ParseResult.js';

/**
 * Defines a, object that encapsulates a function that will attempt to parse the input stream,
 * and a description of the expected syntax. The function returns a result if parsing
 * was sucessful and undefined if the input could not be parsed. When undefined is returned, the
 * context must not be modified because multiple parsers will be tried in succession to decide
 * which way the syntax is going.
 *
 * If no parsers are found, then the descriptions are used to tell the user what was expected in
 * the syntax at this point.
 */
export type SyntaxParser = {
    description: string;
    parseFunction: (context: IContext) => ParseResult | undefined;
};
