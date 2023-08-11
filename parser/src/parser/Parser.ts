import { IContext } from '#interfaces/IContext.js';
import { IParser } from '#interfaces/IParser.js';
import { IToken } from '#interfaces/IToken.js';
import { parseToken } from './functions/parseToken.js';

export class Parser implements IParser {
  extractNextToken(context: IContext): IToken {
    return parseToken(context);
  }

  parseUntil(
    context: IContext,
    predicate: (token: IToken) => boolean,
  ): IToken[] {
    if (context.isDryRun)
      throw new Error('Dry run only works with `extractNextToken`');

    const tokens: IToken[] = [];
    try {
      while (!context.buffer.isEof()) {
        const token = this.extractNextToken(context);
        tokens.push(token);
        if (token.length == 0) {
          context.syntaxError(
            'Unexpected character found, please check language syntax definition',
          );
          return tokens;
        }
        if (predicate(token)) return tokens;
      }
    } catch (error: any) {
      context.syntaxError(
        'Too many issues to continue, fix syntax errors at the top of the file and try again',
      );
    }
    return tokens;
  }

  skipUntil(
    context: IContext,
    predicate: (token: IToken) => boolean,
  ): IToken | null {
    if (context.isDryRun)
      throw new Error('Dry run only works with `extractNextToken`');

    while (!context.buffer.isEof()) {
      const token = this.extractNextToken(context);
      if (token.length == 0) {
        context.syntaxError(
          'Unexpected character found, please check language syntax definition',
        );
        return null;
      }
      if (predicate(token)) return token;
    }
    return null;
  }

  parse(context: IContext): IToken[] {
    if (context.isDryRun)
      throw new Error('Dry run only works with `extractNextToken`');

    return this.parseUntil(context, () => false);
  }
}
