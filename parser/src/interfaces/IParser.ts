import { IContext } from '#interfaces/IContext.js';
import { IToken } from '#interfaces/IToken.js';

export interface IParser {
  peekNextToken(context: IContext): IToken;
  extractNextToken(context: IContext): IToken;
}
