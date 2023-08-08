import { IContext } from '#interfaces/IContext.js';
import { ParseResult } from './ParseResult.js'
import { parseNamedScope } from './parseNamedScope.js'
import { parseScope } from './parseScope.js'
import { eol } from '#interfaces/IParsable.js'

export function parseMessage(context: IContext, updateContext: boolean): ParseResult {
  switch (context.currentState.subState) {
    case 'identifier': return parseMessageIdentifier(context, updateContext)
    case 'scope': return parseMessageScope(context, updateContext)
    case 'definition': return parseMessageDefinition(context, updateContext)
    case 'field': return parseMessageField(context, updateContext)
  }
  throw new Error('Unknown message sub-state ' + context.currentState.subState);
}

  function parseMessageIdentifier(
    context: IContext,
    updateContext: boolean,
  ): ParseResult {
    return parseNamedScope(
      context,
      updateContext,
      'message',
      'scope'
    );
  }

  function parseMessageScope(
    context: IContext,
    updateContext: boolean,
  ): ParseResult {
    return parseScope(context, updateContext);
  }

  function parseMessageDefinition(
    context: IContext,
    updateContext: boolean,
  ): ParseResult {
    context.buffer.skipWhitespace();
    const text = context.buffer.extractToEnd();
    if (updateContext) context.currentState.subState = 'field'
    return { text, tokenType: 'Identifier' };
  }

  function parseMessageField(
    context: IContext,
    updateContext: boolean,
  ): ParseResult {
    context.buffer.skipSepararator();
    const text = context.buffer.extractToAny([eol]);
    if (updateContext) context.currentState.subState = 'definition'
    return { text, tokenType: 'Identifier' };
  }
