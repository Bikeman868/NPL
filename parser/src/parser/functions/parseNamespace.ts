import { IContext } from '#interfaces/IContext.js';
import { ParseResult } from './ParseResult.js'
import { parseNamedScope } from './parseNamedScope.js'
import { parseScope } from './parseScope.js'
import { parseScopeDefinition } from './parseScopeDefinition.js'

export function parseNamespace(context: IContext, updateContext: boolean): ParseResult {
  switch (context.currentState.subState) {
    case 'identifier': return parseNamespaceIdentifier(context, updateContext)
    case 'scope': return parseNamespaceScope(context, updateContext)
    case 'definition': return parseNamespaceDefinition(context, updateContext)
  }
  throw new Error('Unknown namespace sub-state ' + context.currentState.subState);
}

  function parseNamespaceIdentifier(
    context: IContext,
    updateContext: boolean,
  ): ParseResult {
    return parseNamedScope(
      context,
      updateContext,
      'namespace',
      'scope'
    );
  }

  function parseNamespaceScope(
    context: IContext,
    updateContext: boolean,
  ): ParseResult {
    return parseScope(context, updateContext);
  }

  function parseNamespaceDefinition(
    context: IContext,
    updateContext: boolean,
  ): ParseResult {
    return parseScopeDefinition(context, updateContext, [
      { keyword: 'application', state: 'application', subState: 'identifier' },
      { keyword: 'message', state: 'message', subState: 'identifier' },
      { keyword: 'network', state: 'network', subState: 'identifier' },
    ]);
  }
