import { IContext } from '#interfaces/IContext.js';
import { IParser } from '#interfaces/IParser.js';
import { IToken } from '#interfaces/IToken.js';
import { Token } from './Token.js';
import { TokenType } from '#interfaces/TokenType.js';
import { StateName } from '#interfaces/IParserState.js';

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
      return `Parsing token at offset ${pos.offset} (L${pos.line}:C${pos.column}) in ${state} state`;
    });

    context.capturePosition();

    let result: ParseResult | undefined;

    switch (context.currentState.state) {
      case 'SourceFile':
        result = this.parseSourceFile(context, updateContext);
        break;
      case 'UsingIdentifier':
        result = this.parseUsing(context, updateContext);
        break;
      case 'NamespaceIdentifier':
        result = this.parseNamespaceIdentifier(context, updateContext);
        break;
      case 'NamespaceDefinition':
        result = this.parseNamespaceDefinition(context, updateContext);
        break;
      case 'ApplicationIdentifier':
        result = this.parseApplicationIdentifier(context, updateContext);
        break;
      case 'ApplicationDefinition':
        result = this.parseApplicationDefinition(context, updateContext);
        break;
      case 'NetworkIdentifier':
        result = this.parseNetworkIdentifier(context, updateContext);
        break;
      case 'NetworkDefinition':
        result = this.parseNetworkDefinition(context, updateContext);
        break;
      case 'MessageIdentifier':
        result = this.parseMessageIdentifier(context, updateContext);
        break;
      case 'MessageDefinition':
        result = this.parseMessageDefinition(context, updateContext);
        break;
      case 'ConfigDefinition':
        result = this.parseConfigDefinition(context, updateContext);
        break;
    }
    if (!result) throw new Error('Unknown state ' + context.currentState.state);

    const position = context.buffer.getPosition();
    const length = position.offset - context.position.offset;

    if (!updateContext) context.restorePosition();
    return new Token(result.text, result.tokenType, length);
  }

  private parseUsing(context: IContext, updateContext: boolean): ParseResult {
    context.buffer.skipSepararator();
    const text = context.buffer.extractToEnd();
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

  private parseNamedScope(
    context: IContext,
    updateContext: boolean,
    keyword: string,
    nextState: StateName,
  ): ParseResult {
    context.buffer.skipSepararator();
    const text = context.buffer.extractToEnd('{');
    if (updateContext) {
      if (context.buffer.hasScope()) {
        context.pushState(nextState);
      } else {
        context.popState();
      }
      if (!text)
        context.syntaxError(
          'Keyword ' +
            keyword +
            ' must be followed by the name of a ' +
            keyword,
        );
    }
    return { text, tokenType: 'QualifiedIdentifier' };
  }

  private parseNamespaceIdentifier(
    context: IContext,
    updateContext: boolean,
  ): ParseResult {
    return this.parseNamedScope(
      context,
      updateContext,
      'namespace',
      'NamespaceDefinition',
    );
  }

  private parseApplicationIdentifier(
    context: IContext,
    updateContext: boolean,
  ): ParseResult {
    return this.parseNamedScope(
      context,
      updateContext,
      'application',
      'ApplicationDefinition',
    );
  }

  private parseNetworkIdentifier(
    context: IContext,
    updateContext: boolean,
  ): ParseResult {
    return this.parseNamedScope(
      context,
      updateContext,
      'network',
      'NetworkDefinition',
    );
  }

  private parseMessageIdentifier(
    context: IContext,
    updateContext: boolean,
  ): ParseResult {
    return this.parseNamedScope(
      context,
      updateContext,
      'message',
      'MessageDefinition',
    );
  }

  private parseScopeDefinition(
    context: IContext,
    updateContext: boolean,
    options: { keyword: string; nextState: StateName }[],
  ): ParseResult {
    context.buffer.skipWhitespace();
    const text = context.buffer.extractToEnd();

    if (updateContext) {
      if (text == 'config') {
        if (context.buffer.hasScope()) context.pushState('ConfigDefinition');
      } else {
        let isValid = false;
        for (let option of options) {
          if (text == option.keyword) {
            context.pushState(option.nextState);
            isValid = true;
            break;
          }
        }
        if (!isValid) {
          let msg = 'Expecting one of `config`, ';
          for (var i = 0; i < options.length; i++) {
            msg += ', `' + options[i].keyword + '`';
          }
          msg += ' but found `' + text + `'`;
          context.syntaxError(msg);
        }
      }
    }

    return { text, tokenType: 'Keyword' };
  }

  private parseSourceFile(
    context: IContext,
    updateContext: boolean,
  ): ParseResult {
    return this.parseScopeDefinition(context, updateContext, [
      { keyword: 'using', nextState: 'UsingIdentifier' },
      { keyword: 'namespace', nextState: 'NamespaceIdentifier' },
    ]);
  }

  private parseNamespaceDefinition(
    context: IContext,
    updateContext: boolean,
  ): ParseResult {
    return this.parseScopeDefinition(context, updateContext, [
      { keyword: 'application', nextState: 'ApplicationIdentifier' },
      { keyword: 'message', nextState: 'MessageIdentifier' },
      { keyword: 'network', nextState: 'NetworkIdentifier' },
    ]);
  }

  private parseApplicationDefinition(
    context: IContext,
    updateContext: boolean,
  ): ParseResult {
    return this.parseScopeDefinition(context, updateContext, [
      { keyword: 'connection', nextState: 'ConnectionIdentifier' },
    ]);
  }

  private parseNetworkDefinition(
    context: IContext,
    updateContext: boolean,
  ): ParseResult {
    return this.parseScopeDefinition(context, updateContext, [
      { keyword: 'ingress', nextState: 'ApplicationIdentifier' },
      { keyword: 'egress', nextState: 'MessageIdentifier' },
      { keyword: 'process', nextState: 'NetworkIdentifier' },
    ]);
  }

  private parseMessageDefinition(
    context: IContext,
    updateContext: boolean,
  ): ParseResult {
    context.buffer.skipWhitespace();
    const text = context.buffer.extractToEnd();
    return { text, tokenType: 'Keyword' };
  }

  private parseConfigDefinition(
    context: IContext,
    updateContext: boolean,
  ): ParseResult {
    context.buffer.skipWhitespace();
    const text = context.buffer.extractToEnd();
    return { text, tokenType: 'Keyword' };
  }
}
