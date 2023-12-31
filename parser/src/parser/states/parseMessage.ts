import { IContext } from '#interfaces/IContext.js';
import { ParseResult } from '../functions/ParseResult.js';
import { parseNamedDefinition } from '../functions/parseNamedDefinition.js';
import { parseScope } from '../functions/parseScope.js';
import {
  identifier,
  qualifiedIdentifier,
  whitespace,
  closeScope,
  separator,
} from '#interfaces/charsets.js';

export function parseMessage(context: IContext): ParseResult {
  switch (context.currentState.subState) {
    case 'start':
      return parseNamedDefinition(context, 'message');
    case 'scope':
      return parseScope(context);
    case 'definition':
      return parseMessageDefinition(context);
    case 'field':
      return parseMessageField(context);
  }
  throw new Error('Unknown message sub-state ' + context.currentState.subState);
}

function parseMessageDefinition(context: IContext): ParseResult {
  if (context.buffer.isEndScope()) {
    context.buffer.skipCount(1);
    context.buffer.skipAny(whitespace);
    context.popState();
    return { text: closeScope, tokenType: 'ScopeEnd' };
  } else {
    const name = context.buffer.extractAny(qualifiedIdentifier);
    context.buffer.skipAny(separator);
    context.setSubState('field');
    if (!name)
      context.syntaxError(
        `Message field type expected, but "${context.buffer.extractToAny(
          whitespace,
        )}" found`,
      );
    return { text: name, tokenType: 'QualifiedIdentifier' };
  }
}

function parseMessageField(context: IContext): ParseResult {
  const text = context.buffer.extractAny(identifier);
  context.buffer.skipToEol();
  context.buffer.skipAny(whitespace);

  context.setSubState('definition');

  if (!text)
    context.syntaxError(
      `Message field name expected, but "${context.buffer.extractToAny(
        whitespace,
      )}" found`,
    );
  return { text, tokenType: 'Identifier' };
}
