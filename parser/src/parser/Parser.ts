import { IContext } from '#interfaces/IContext.js';
import { IParser } from '#interfaces/IParser.js';
import { IToken } from '#interfaces/IToken.js';
import { Token } from './Token.js';
import { TokenType } from '#interfaces/TokenType.js';
import { ParserStates } from '#interfaces/IParserState.js';

type ParseResult = { text: string; tokenType: TokenType };

export class Parser implements IParser {
  extractNextToken(context: IContext): IToken {
    return this.parseToken(context, true);
  }

  peekNextToken(context: IContext): IToken {
    return this.parseToken(context, false);
  }

  private parseToken(context: IContext, updateContext: boolean): IToken {
    context.capturePosition();

    let result: ParseResult | undefined;

    switch (context.currentState.state) {
      case ParserStates.Initial:
        result = this.parseInitial(context, updateContext);
        break;
    }
    if (!result) throw new Error('Unknown state ' + context.currentState.state);

    const position = context.buffer.getPosition();
    const length = position.offset - context.position.offset;

    if (!updateContext) context.restorePosition();
    return new Token(result.text, result.tokenType, length);
  }

  private parseInitial(context: IContext, updateContext: boolean): ParseResult {
    context.buffer.skipWhitespace();
    const text = context.buffer.extractToWhitespace();
    return { text, tokenType: "Keyword" };
  }
}
