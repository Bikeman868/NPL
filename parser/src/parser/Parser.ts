import { IContext } from '#interfaces/IContext.js';
import { IParser } from '#interfaces/IParser.js';
import { IToken } from '#interfaces/IToken.js';
import { Token } from './Token.js';
import { TokenType } from '#interfaces/TokenType.js';

type ParseResult = { text: string; tokenType: TokenType };

export class Parser implements IParser {
  extractNextToken(context: IContext): IToken {
    return this.parseToken(context, true);
  }

  peekNextToken(context: IContext): IToken {
    return this.parseToken(context, false);
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

  private parseToken(context: IContext, updateContext: boolean): IToken {
    context.debug(() => { 
      const pos = context.buffer.getPosition();
      const state = context.currentState.getDescription();
      return `Parsing token at offset ${pos.offset} (L${pos.line}:C${pos.column}) in ${state} state`});

    context.capturePosition();

    let result: ParseResult | undefined;

    switch (context.currentState.state) {
      case 'Initial':
        result = this.parseInitial(context, updateContext);
        break;
      case 'Using':
        result = this.parseUsing(context, updateContext);
        break;
      case 'Namespace':
        result = this.parseNamespace(context, updateContext);
        break;
        case 'NamespaceDefinition':
          result = this.parseNamespaceDefinition(context, updateContext);
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
    switch (text) {
      case 'using':
        if (updateContext) {
          context.pushState('Using');
        }
        break;
      case 'namespace':
        if (updateContext) {
          context.pushState('Namespace');
        }
        break;
      default:
        context.syntaxError('Expecting `using` or `namespace` keyword');
        break;
    }
    return { text, tokenType: 'Keyword' };
  }

  private parseUsing(context: IContext, updateContext: boolean): ParseResult {
    context.buffer.skipSepararator();
    const text = context.buffer.extractToWhitespace();
    context.buffer.skipToEol();
    if (updateContext) {
      if (!text)
        context.syntaxError(
          'Using keyword must be followed by the name of a namespace',
        );
      context.popState();
    }
    return { text, tokenType: 'QualifiedIdentifier' };
  }

  private parseNamespace(
    context: IContext,
    updateContext: boolean,
  ): ParseResult {
    context.buffer.skipSepararator();
    const text = context.buffer.extractToWhitespace();
    if (updateContext) {
      if (context.buffer.hasScope()) {
        context.pushState('NamespaceDefinition');
      } else {
        context.popState();
      }
      if (!text)
        context.syntaxError(
          'Namespace keyword must be followed by the name of a namespace',
        );
    }
    return { text, tokenType: 'QualifiedIdentifier' };
  }

  parseNamespaceDefinition(context: IContext, updateContext: boolean): ParseResult  {
    if (updateContext) {
      context.popState();
    }
    return { text: '', tokenType: 'Identifier' };
  }
}
