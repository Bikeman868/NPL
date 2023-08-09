import { IContext } from '#interfaces/IContext.js';
import { ParseResult } from '../functions/ParseResult.js';
import { parseNamedScope } from '../functions/parseNamedScope.js';
import { parseScope } from '../functions/parseScope.js';
import { parseScopeDefinition } from '../functions/parseScopeDefinition.js';

export function parseNamespace(
  context: IContext,
  updateContext: boolean,
): ParseResult {
  switch (context.currentState.subState) {
    case 'identifier':
      return parseNamedScope(context, updateContext, 'namespace');
    case 'scope':
      return parseScope(context, updateContext);
    case 'definition':
      return parseNamespaceDefinition(context, updateContext);
  }
  throw new Error(
    'Unknown namespace sub-state ' + context.currentState.subState,
  );
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
