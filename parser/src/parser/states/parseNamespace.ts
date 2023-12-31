import { IContext } from '#interfaces/IContext.js';
import { ParseResult } from '../functions/ParseResult.js';
import { parseNamedReference } from '../functions/parseNamedReference.js';
import { parseScope } from '../functions/parseScope.js';
import { parseScopeDefinition } from '../functions/parseScopeDefinition.js';

export function parseNamespace(context: IContext): ParseResult {
  switch (context.currentState.subState) {
    case 'start':
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
    { keyword: 'application', state: 'application' },
    { keyword: 'message', state: 'message' },
    { keyword: 'network', state: 'network' },
    { keyword: 'enum', state: 'enum' },
  ]);
}
