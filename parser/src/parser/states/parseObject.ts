import { IContext } from '#interfaces/IContext.js';
import { ParseResult } from '../functions/ParseResult.js';
import { parseNamedScope } from '../functions/parseNamedScope.js';
import { parseScope } from '../functions/parseScope.js';
import { closeScope, eol } from '#interfaces/IParsable.js';

export function parseObject(context: IContext): ParseResult {
  switch (context.currentState.subState) {
    case 'identifier':
      return parseNamedScope(context, 'object');
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
    context.popState();
    return { text: closeScope, tokenType: 'ScopeEnd' };
  } else {
    const text = context.buffer.extractToEnd();
    context.setSubState('field');
    return { text, tokenType: 'Identifier' };
  }
}

function parseObjectField(context: IContext): ParseResult {
  context.buffer.skipSepararator();
  const text = context.buffer.extractToAny([eol]);
  context.setSubState('definition');
  return { text, tokenType: 'Expression' };
}
