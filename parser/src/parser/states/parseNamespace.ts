import { IContext } from '#interfaces/IContext.js';
import { ParseResult } from '../functions/ParseResult.js';
import { parseNamedReference } from '../functions/parseNamedReference.js';
import { parseScope } from '../functions/parseScope.js';
import { parseScopeDefinition } from '../functions/parseScopeDefinition.js';

export function parseNamespace(context: IContext): ParseResult {
  switch (context.currentState.subState) {
    case 'identifier':
      return parseNamedReference(context, 'namespace');
    case 'scope':
      return parseScope(context);
    case 'definition':
      return parseNamespaceDefinition(context);
  }
  throw new Error(
    'Unknown namespace sub-state ' + context.currentState.subState,
  );
}

function parseNamespaceDefinition(context: IContext): ParseResult {
  return parseScopeDefinition(context, [
    { keyword: 'application', state: 'application', subState: 'identifier' },
    { keyword: 'message', state: 'message', subState: 'identifier' },
    { keyword: 'network', state: 'network', subState: 'identifier' },
  ]);
}
