import { IContext } from '#interfaces/IContext.js';
import { ParseResult } from '../functions/ParseResult.js';
import { parseNamedDefinition } from '../functions/parseNamedDefinition.js';
import { parseScope } from '../functions/parseScope.js';
import { parseScopeDefinition } from '../functions/parseScopeDefinition.js';

export function parseNetwork(context: IContext): ParseResult {
  switch (context.currentState.subState) {
    case 'identifier':
      return parseNamedDefinition(context, 'network');
    case 'scope':
      return parseScope(context);
    case 'definition':
      return parseNetworkDefinition(context);
  }
  throw new Error('Unknown network sub-state ' + context.currentState.subState);
}

function parseNetworkDefinition(context: IContext): ParseResult {
  return parseScopeDefinition(context, [
    { keyword: 'ingress', state: 'entrypoint', subState: 'identifier' },
    { keyword: 'egress', state: 'entrypoint', subState: 'identifier' },
    { keyword: 'default', state: 'entrypoint', subState: 'identifier' },
    { keyword: 'process', state: 'process', subState: 'identifier' },
  ]);
}
