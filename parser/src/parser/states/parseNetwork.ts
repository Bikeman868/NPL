import { IContext } from '#interfaces/IContext.js';
import { ParseResult } from '../functions/ParseResult.js';
import { parseNamedScope } from '../functions/parseNamedScope.js';
import { parseScope } from '../functions/parseScope.js';
import { parseScopeDefinition } from '../functions/parseScopeDefinition.js';
import { openScope } from '#interfaces/IParsable.js';

export function parseNetwork(context: IContext): ParseResult {
  switch (context.currentState.subState) {
    case 'identifier':
      return parseNamedScope(context, 'network');
    case 'scope':
      return parseScope(context);
    case 'definition':
      return parseNetworkDefinition(context);
    case 'kind':
      return parseNetworkKind(context);
  }
  throw new Error('Unknown network sub-state ' + context.currentState.subState);
}

function parseNetworkDefinition(context: IContext): ParseResult {
  return parseScopeDefinition(context, [
    { keyword: 'ingress', subState: 'kind' },
    { keyword: 'egress', subState: 'kind' },
    { keyword: 'default', subState: 'kind' },
    { keyword: 'process', state: 'process', subState: 'identifier' },
  ]);
}

function parseNetworkKind(context: IContext): ParseResult {
  const keyword = context.buffer.extractToEnd(openScope);
  context.buffer.skipSepararator();

  if (keyword == 'ingress' || keyword == 'egress' || keyword == 'default') {
    return { text: keyword, tokenType: 'Keyword' };
  }

  if (context.buffer.hasScope()) {
    context.pushState('route', 'scope');
  } else {
    context.popState();
  }

  if (keyword) return { text: keyword, tokenType: 'Identifier' };
  else return { text: openScope, tokenType: 'ScopeStart' };
}
