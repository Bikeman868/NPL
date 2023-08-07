import { IContext } from '#interfaces/IContext.js';
import { IToken } from '#interfaces/IToken.js';

export interface IParser {
  parse(context: IContext): IToken[];
  peekNextToken(context: IContext): IToken;
  extractNextToken(context: IContext): IToken;
  parseUntil(
    context: IContext,
    predicate: (token: IToken) => boolean,
  ): IToken[];
  skipUntil(
    context: IContext,
    predicate: (token: IToken) => boolean,
  ): IToken | null;
}
