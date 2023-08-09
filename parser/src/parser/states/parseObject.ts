import { IContext } from '#interfaces/IContext.js';
import { ParseResult } from '../functions/ParseResult.js';
import { parseNamedScope } from '../functions/parseNamedScope.js';
import { parseScope } from '../functions/parseScope.js';
import { closeScope, eol } from '#interfaces/IParsable.js';

export function parseObject(
  context: IContext,
  updateContext: boolean,
): ParseResult {
  switch (context.currentState.subState) {
    case 'identifier':
      return parseObjectIdentifier(context, updateContext);
    case 'scope':
      return parseScope(context, updateContext);
    case 'definition':
      return parseObjectDefinition(context, updateContext);
    case 'field':
      return parseObjectField(context, updateContext);
  }
  throw new Error('Unknown object sub-state ' + context.currentState.subState);
}

function parseObjectIdentifier(
  context: IContext,
  updateContext: boolean,
): ParseResult {
  return parseNamedScope(context, updateContext, 'object');
}

function parseObjectDefinition(
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

function parseObjectField(
  context: IContext,
  updateContext: boolean,
): ParseResult {
  context.buffer.skipSepararator();
  const text = context.buffer.extractToAny([eol]);
  if (updateContext) context.currentState.subState = 'definition';
  return { text, tokenType: 'Expression' };
}
