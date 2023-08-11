import { IContext } from '#interfaces/IContext.js';
import { ParseResult } from '../functions/ParseResult.js';
import { parseNamedScope } from '../functions/parseNamedScope.js';
import { parseScope } from '../functions/parseScope.js';
import { parseScopeDefinition } from '../functions/parseScopeDefinition.js';

export function parseConnection(context: IContext): ParseResult {
  switch (context.currentState.subState) {
    case 'identifier':
      return parseNamedScope(context, 'connection');
    case 'scope':
      return parseScope(context);
    case 'definition':
      return parseConnectionDefinition(context);
  }
  throw new Error(
    'Unknown connection sub-state ' + context.currentState.subState,
  );
}

function parseConnectionDefinition(context: IContext): ParseResult {
  return parseScopeDefinition(context, [
    { keyword: 'ingress', state: 'entrypoint', subState: 'identifier' },
    { keyword: 'egress', state: 'entrypoint', subState: 'identifier' },
  ]);
}
