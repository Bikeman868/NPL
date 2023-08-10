import { IContext } from '#interfaces/IContext.js';
import { ParseResult } from '../functions/ParseResult.js';
import { parseScope } from '../functions/parseScope.js';
import { closeScope, eol } from '#interfaces/IParsable.js';

export function parseObject(context: IContext): ParseResult {
  switch (context.currentState.subState) {
    case 'scope':
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
    context.buffer.skipWhitespace();
    context.popState();
    return { text: closeScope, tokenType: 'ScopeEnd' };
  }

  const fieldname = context.buffer.extractToEnd();
  context.buffer.skipSepararator();
  context.setSubState('field');

  return { text: fieldname, tokenType: 'Identifier' };
}

function parseObjectField(context: IContext): ParseResult {
  const expression = context.buffer.extractToAny([eol, closeScope]);
  context.buffer.skipWhitespace();
  context.setSubState('definition');

  return { text: expression, tokenType: 'Expression' };
}
