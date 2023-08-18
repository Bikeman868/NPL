import { IContext } from '#interfaces/IContext.js';
import { ParseResult } from '../functions/ParseResult.js';
import { parseScope } from '../functions/parseScope.js';
import {
  closeScope,
  identifier,
  whitespace,
  newline,
  separator,
} from '#interfaces/charsets.js';

export function parseObject(context: IContext): ParseResult {
  switch (context.currentState.subState) {
    case 'start':
      return parseScope(context);
    case 'definition':
      return parseObjectDefinition(context);
    case 'field':
      return parseObjectField(context);
  }
  throw new Error('Unknown object sub-state ' + context.currentState.subState);
}

function parseObjectDefinition(context: IContext): ParseResult {
  if (context.buffer.isEndScope()) {
    context.buffer.skipCount(1);
    context.buffer.skipAny(whitespace);
    context.popState();
    return { text: closeScope, tokenType: 'ScopeEnd' };
  }

  const fieldname = context.buffer.extractAny(identifier);
  context.buffer.skipAny(separator);
  context.setSubState('field');

  if (!fieldname)
    context.syntaxError(
      `Field name expected, but "${context.buffer.extractToAny(
        whitespace,
      )}" found`,
    );
  return { text: fieldname, tokenType: 'Identifier' };
}

function parseObjectField(context: IContext): ParseResult {
  const expression = context.buffer.extractToEol();
  context.buffer.skipAny(whitespace);
  context.setSubState('definition');

  if (!expression) context.syntaxError('Expression expected');
  return { text: expression, tokenType: 'Expression' };
}
