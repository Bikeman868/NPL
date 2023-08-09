import { IContext } from '#interfaces/IContext.js';
import { IParser } from '#interfaces/IParser.js';
import { IToken } from '#interfaces/IToken.js';
import { parseToken } from './functions/parseToken.js';

export class Parser implements IParser {
  extractNextToken(context: IContext): IToken {
    return parseToken(context, true);
  }

  peekNextToken(context: IContext): IToken {
    return parseToken(context, false);
  }

  parseUntil(
    context: IContext,
    predicate: (token: IToken) => boolean,
  ): IToken[] {
    const tokens: IToken[] = [];
    while (!context.buffer.isEof()) {
      const token = this.extractNextToken(context);
      tokens.push(token);
      if (predicate(token)) return tokens;
    }
    return tokens;
  }

  skipUntil(
    context: IContext,
    predicate: (token: IToken) => boolean,
  ): IToken | null {
    while (!context.buffer.isEof()) {
      const token = this.extractNextToken(context);
      if (predicate(token)) return token;
    }
    return null;
  }

  parse(context: IContext): IToken[] {
    return this.parseUntil(context, () => false);
  }
}
