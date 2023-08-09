import { IContext } from '#interfaces/IContext.js';
import { ParseResult } from '../functions/ParseResult.js';
import { parseNamedScope } from '../functions/parseNamedScope.js';
import { parseScope } from '../functions/parseScope.js';
import { parseScopeDefinition } from '../functions/parseScopeDefinition.js';
import { openScope } from '#interfaces/IParsable.js'

export function parseNetwork(
  context: IContext,
  updateContext: boolean,
): ParseResult {
  switch (context.currentState.subState) {
    case 'identifier':
      return parseNetworkIdentifier(context, updateContext);
    case 'scope':
      return parseScope(context, updateContext);
    case 'definition':
      return parseNetworkDefinition(context, updateContext);
    case 'kind':
      return parseNetworkKind(context, updateContext);
  }
  throw new Error('Unknown network sub-state ' + context.currentState.subState);
}

function parseNetworkIdentifier(
  context: IContext,
  updateContext: boolean,
): ParseResult {
  return parseNamedScope(context, updateContext, 'network');
}

function parseNetworkDefinition(
  context: IContext,
  updateContext: boolean,
): ParseResult {
  return parseScopeDefinition(context, updateContext, [
    { keyword: 'ingress', subState: 'kind' },
    { keyword: 'egress', subState: 'kind' },
    { keyword: 'default', subState: 'kind' },
    { keyword: 'process', state: 'process', subState: 'identifier' },
  ]);
}

function parseNetworkKind(
  context: IContext,
  updateContext: boolean,
): ParseResult {
  const keyword = context.buffer.extractToEnd(openScope)
  context.buffer.skipSepararator()

  if (keyword == 'ingress' || keyword == 'egress' || keyword == 'default') {
    return { text: keyword, tokenType: 'Keyword' }
  }
  
  if (updateContext) {
    if (context.buffer.hasScope()) {
      context.pushState('route', 'scope');
    } else {
      context.popState();
    }
  }
  return { text: keyword, tokenType: 'Identifier' }
}
