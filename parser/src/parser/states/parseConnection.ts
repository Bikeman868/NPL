import { IContext } from '#interfaces/IContext.js';
import { ParseResult } from '../functions/ParseResult.js';
import { parseNamedScope } from '../functions/parseNamedScope.js';
import { parseScope } from '../functions/parseScope.js';
import { parseScopeDefinition } from '../functions/parseScopeDefinition.js';
import { openScope } from '#interfaces/IParsable.js'

export function parseConnection(
  context: IContext,
  updateContext: boolean,
): ParseResult {
  switch (context.currentState.subState) {
    case 'identifier':
      return parseConnectionIdentifier(context, updateContext);
    case 'scope':
      return parseScope(context, updateContext);
    case 'definition':
      return parseConnectionDefinition(context, updateContext);
    case 'kind':
      return parseConnectionKind(context, updateContext);
  }
  throw new Error(
    'Unknown connection sub-state ' + context.currentState.subState,
  );
}

function parseConnectionIdentifier(
  context: IContext,
  updateContext: boolean,
): ParseResult {
  return parseNamedScope(context, updateContext, 'connection');
}

function parseConnectionDefinition(
  context: IContext,
  updateContext: boolean,
): ParseResult {
  return parseScopeDefinition(context, updateContext, [
    { keyword: 'ingress', subState: 'kind' },
    { keyword: 'egress', subState: 'kind' },
  ]);
}

function parseConnectionKind(
  context: IContext,
  updateContext: boolean,
): ParseResult {
  const keyword = context.buffer.extractToEnd(openScope)
  context.buffer.skipSepararator()

  if (keyword == 'ingress' || keyword == 'egress') {
    return { text: keyword, tokenType: 'Keyword' }
  }
  
  context.buffer.skipToEol();
  if (updateContext)       context.popState();
  
  return { text: keyword, tokenType: 'Identifier' }
}
