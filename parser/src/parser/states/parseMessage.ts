import { IContext } from '#interfaces/IContext.js';
import { ParseResult } from '../functions/ParseResult.js';
import { parseNamedScope } from '../functions/parseNamedScope.js';
import { parseScope } from '../functions/parseScope.js';
import { closeScope } from '#interfaces/IParsable.js';

export function parseMessage(
  context: IContext,
  updateContext: boolean,
): ParseResult {
  switch (context.currentState.subState) {
    case 'identifier':
      return parseMessageIdentifier(context, updateContext);
    case 'scope':
      return parseScope(context, updateContext);
    case 'definition':
      return parseMessageDefinition(context, updateContext);
    case 'field':
      return parseMessageField(context, updateContext);
  }
  throw new Error('Unknown message sub-state ' + context.currentState.subState);
}

function parseMessageIdentifier(
  context: IContext,
  updateContext: boolean,
): ParseResult {
  return parseNamedScope(context, updateContext, 'message');
}

function parseMessageDefinition(
  context: IContext,
  updateContext: boolean,
): ParseResult {
  context.buffer.skipWhitespace();
  if (context.buffer.isEndScope()) {
    if (updateContext) context.popState();
    return { text: closeScope, tokenType: 'ScopeEnd' };
  } else {
    const text = context.buffer.extractToEnd();
    if (updateContext) context.currentState.subState = 'field';
    return { text, tokenType: 'Identifier' };
  }
}

function parseMessageField(
  context: IContext,
  updateContext: boolean,
): ParseResult {
  context.buffer.skipSepararator();
  const text = context.buffer.extractToEnd();
  context.buffer.skipToEol();
  if (updateContext) context.currentState.subState = 'definition';
  return { text, tokenType: 'Identifier' };
}
