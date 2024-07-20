import { IContext } from '#interfaces/IContext.js';
import { IToken } from '#interfaces/IToken.js';

/**
 * Defines the methods that the parser provides to applications that need to
 * parse NPL source code
 */
export interface IParser {
    parse(context: IContext): IToken[];
    extractNextToken(context: IContext): IToken | undefined;
    parseUntil(context: IContext, predicate: (token: IToken) => boolean): IToken[];
    skipUntil(context: IContext, predicate: (token: IToken) => boolean): IToken | null;
}
