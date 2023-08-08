import { IContext } from '#interfaces/IContext.js';
import { ParseResult } from './ParseResult.js'
import { parseNamedScope } from './parseNamedScope.js'
import { parseScope } from './parseScope.js'
import { parseScopeDefinition } from './parseScopeDefinition.js'

export function parseNetwork(context: IContext, updateContext: boolean): ParseResult {
  switch (context.currentState.subState) {
    case 'identifier': return parseNetworkIdentifier(context, updateContext)
    case 'scope': return parseNetworkScope(context, updateContext)
    case 'definition': return parseNetworkDefinition(context, updateContext)
    case 'kind': return parseNetworkKind(context, updateContext)
  }
  throw new Error('Unknown network sub-state ' + context.currentState.subState);
}

  function parseNetworkIdentifier(
    context: IContext,
    updateContext: boolean,
  ): ParseResult {
    return parseNamedScope(
      context,
      updateContext,
      'network',
      'scope'
    );
  }

  function parseNetworkScope(
    context: IContext,
    updateContext: boolean,
  ): ParseResult {
    return parseScope(context, updateContext);
  }

  function parseNetworkDefinition(
    context: IContext,
    updateContext: boolean,
  ): ParseResult {
    return parseScopeDefinition(context, updateContext, [
      { keyword: 'ingress', subState: 'kind' },
      { keyword: 'egress', subState: 'kind' },
      { keyword: 'process', state: 'process', subState: 'identifier' },
    ]);
  }

  function parseNetworkKind(
    context: IContext,
    updateContext: boolean,
  ): ParseResult {
    throw new Error('Not implemented yet')
  }
