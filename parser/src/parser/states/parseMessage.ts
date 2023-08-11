import { IContext } from '#interfaces/IContext.js';
import { ParseResult } from '../functions/ParseResult.js';
import { parseNamedScope } from '../functions/parseNamedScope.js';
import { parseScope } from '../functions/parseScope.js';
import { identifier, whitespace, closeScope } from '#interfaces/charsets.js';

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
    const name = context.buffer.extractAny(identifier);
    context.buffer.skipSepararator();
    context.setSubState('field');
    if (!name)
      context.syntaxError(
        `Message field type expected, but "${context.buffer.extractToAny(
          whitespace,
        )}" found`,
      );
    return { text: name, tokenType: 'Identifier' };
  }
}

function parseMessageField(context: IContext): ParseResult {
  const text = context.buffer.extractAny(identifier);
  context.buffer.skipToEol();
  context.buffer.skipWhitespace();

  context.setSubState('definition');

  if (!text)
    context.syntaxError(
      `Message field name expected, but "${context.buffer.extractToAny(
        whitespace,
      )}" found`,
    );
  return { text, tokenType: 'Identifier' };
}
