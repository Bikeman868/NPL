import { IContext } from '#interfaces/IContext.js';
import { ParseResult } from '../functions/ParseResult.js';
import { parseScope } from '../functions/parseScope.js';
import { parseQualifiedReference } from '../functions/parseQualifiedReference.js';
import { parseScopeDefinition } from '../functions/parseScopeDefinition.js';

export function parseConnectionEntry(context: IContext): ParseResult {
  switch (context.currentState.subState) {
    case 'identifier':
      return parseQualifiedReference(context, ['ingress', 'egress', 'network']);
    case 'scope':
      return parseScope(context);
    case 'definition':
      return parseEntrypointDefinition(context);
  }
  throw new Error(
    'Unknown entrypoint sub-state ' + context.currentState.subState,
  );
}

function parseEntrypointDefinition(context: IContext): ParseResult {
  return parseScopeDefinition(context, [
    { keyword: 'network', state: 'route', subState: 'identifier' },
  ]);
}
