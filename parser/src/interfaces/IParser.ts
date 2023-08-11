import { IContext } from './IContext.js';
import { IToken } from './IToken.js';

export interface IParser {
  parse(context: IContext): IToken[];
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
