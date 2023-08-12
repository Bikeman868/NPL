import { IContext } from '#interfaces/IContext.js';
import { ParseResult } from '../functions/ParseResult.js';
import { parseScope } from '../functions/parseScope.js';
import { parseScopeDefinition } from '../functions/parseScopeDefinition.js';
import { qualifiedIdentifier } from '#interfaces/charsets.js';
import { TokenType } from '#interfaces/TokenType.js';

export function parseAccept(context: IContext): ParseResult {
  switch (context.currentState.subState) {
    case 'identifier':
      return parseIdentifier(context);
    case 'scope':
      return parseScope(context);
    case 'definition':
      return parseAcceptDefinition(context);
  }
  throw new Error('Unknown accept sub-state ' + context.currentState.subState);
}

function parseAcceptDefinition(context: IContext): ParseResult {
  return parseScopeDefinition(context, [
    { keyword: 'emit', state: 'emit', subState: 'identifier' },
  ]);
}

function parseIdentifier(context: IContext): ParseResult {
  let name = context.buffer.extractAny(qualifiedIdentifier);

  const tokenType: TokenType = !!name ? 'QualifiedIdentifier' : 'Keyword';

  if (!name) {
    name = context.buffer.extractCount(1);
    if ('*' != name)
      context.syntaxError(
        'Processes can accept a specific message type, the empty message, or all messages using *',
      );
  }

  if (context.buffer.hasScope()) {
    context.setSubState('scope');
  } else {
    context.buffer.skipWhitespace();
    context.popState();
  }

  return { text: name, tokenType: tokenType };
}
