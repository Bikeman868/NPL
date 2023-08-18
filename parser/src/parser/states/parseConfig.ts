import { IContext } from '#interfaces/IContext.js';
import { ParseResult } from '../functions/ParseResult.js';
import { parseScope } from '../functions/parseScope.js';
import {
  closeScope,
  qualifiedIdentifier,
  whitespace,
  newline,
  separator,
} from '#interfaces/charsets.js';

export function parseConfig(context: IContext): ParseResult {
  switch (context.currentState.subState) {
    case 'start':
      return parseScope(context);
    case 'definition':
      return parseConfigDefinition(context);
    case 'field':
      return parseConfigField(context);
  }
  throw new Error('Unknown config sub-state ' + context.currentState.subState);
}

function parseConfigDefinition(context: IContext): ParseResult {
  if (context.buffer.isEndScope()) {
    context.buffer.skipCount(1);
    context.buffer.skipAny(whitespace);
    context.popState();
    return { text: closeScope, tokenType: 'ScopeEnd' };
  }

  const fieldname = context.buffer.extractAny(qualifiedIdentifier);
  context.buffer.skipAny(separator);
  context.setSubState('field');

  if (!fieldname)
    context.syntaxError(
      `Field name expected, but "${context.buffer.extractToAny(
        whitespace,
      )}" found`,
    );
  return { text: fieldname, tokenType: 'QualifiedIdentifier' };
}

function parseConfigField(context: IContext): ParseResult {
  const expression = context.buffer.extractToEol();
  context.buffer.skipAny(whitespace);
  context.setSubState('definition');

  if (!expression) context.syntaxError('Expression constant expected');
  return { text: expression, tokenType: 'Constant' };
}
