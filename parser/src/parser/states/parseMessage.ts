import { IContext } from '#interfaces/IContext.js';
import { ParseResult } from '../functions/ParseResult.js';
import { parseNamedScope } from '../functions/parseNamedScope.js';
import { parseScope } from '../functions/parseScope.js';
import { closeScope } from '#interfaces/IParsable.js';

export function parseMessage(context: IContext): ParseResult {
  switch (context.currentState.subState) {
    case 'identifier':
      return parseMessageIdentifier(context);
    case 'scope':
      return parseScope(context);
    case 'definition':
      return parseMessageDefinition(context);
    case 'field':
      return parseMessageField(context);
  }
  throw new Error('Unknown message sub-state ' + context.currentState.subState);
}

function parseMessageIdentifier(context: IContext): ParseResult {
  return parseNamedScope(context, 'message');
}

function parseMessageDefinition(context: IContext): ParseResult {
  if (context.buffer.isEndScope()) {
    context.buffer.skipCount(1);
    context.buffer.skipWhitespace();
    context.popState();
    return { text: closeScope, tokenType: 'ScopeEnd' };
  } else {
    const text = context.buffer.extractToEnd();
    context.setSubState('field');
    return { text, tokenType: 'Identifier' };
  }
}

function parseMessageField(context: IContext): ParseResult {
  context.buffer.skipSepararator();
  const text = context.buffer.extractToEnd();
  context.buffer.skipToEol();

  context.setSubState('definition');

  return { text, tokenType: 'Identifier' };
}
