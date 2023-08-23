import { IContext } from '#interfaces/IContext.js';
import { ParseResult } from '../functions/ParseResult.js';
import { parseScope } from '../functions/parseScope.js';
import { parseScopeDefinition } from '../functions/parseScopeDefinition.js';
import {
  qualifiedIdentifier,
  identifier,
  whitespace,
  separator,
} from '#interfaces/charsets.js';
import { TokenType } from '#interfaces/TokenType.js';

/*
 * Parses `accept <message-type> {}` statement within a `process` definition
 * Assumes that the cursor is at the first character of the <message-type> and
 */
export function parseProcessAccept(context: IContext): ParseResult {
  switch (context.currentState.subState) {
    case 'start':
      return parseMessageType(context);
    case 'scope':
      return parseScope(context);
    case 'definition':
      return parseAcceptDefinition(context);
  }
  throw new Error('Unknown accept sub-state ' + context.currentState.subState);
}

function parseAcceptDefinition(context: IContext): ParseResult {
  return parseScopeDefinition(context, [
    { keyword: 'emit', state: 'processEmit' },
    { keyword: 'if', state: 'processIf' },
    { keyword: 'else', state: 'processElse' },
    { keyword: 'elseif', state: 'processElseif' },
    { keyword: 'while', state: 'processWhile' },
    { keyword: 'for', state: 'processFor' },
  ]);
}

function parseMessageType(context: IContext): ParseResult {
  let name = context.buffer.extractAny(qualifiedIdentifier);

  const tokenType: TokenType = !!name
    ? name == 'empty'
      ? 'Keyword'
      : 'QualifiedIdentifier'
    : 'Keyword';

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
    context.buffer.skipAny(whitespace);
    context.popState();
  }

  return { text: name, tokenType: tokenType };
}
