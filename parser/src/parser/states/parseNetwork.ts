import { IContext } from '#interfaces/IContext.js';
import { ParseResult } from '../functions/ParseResult.js';
import { parseNamedDefinition } from '../functions/parseNamedDefinition.js';
import { parseScope } from '../functions/parseScope.js';
import { parseScopeDefinition } from '../functions/parseScopeDefinition.js';

export function parseNetwork(context: IContext): ParseResult {
  switch (context.currentState.subState) {
    case 'start':
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
    { keyword: 'ingress', state: 'networkEntry', subState: 'start' },
    { keyword: 'egress', state: 'networkEntry', subState: 'start' },
    { keyword: 'default', state: 'networkEntry', subState: 'start' },
    { keyword: 'process', state: 'process', subState: 'start' },
    { keyword: 'pipe', state: 'pipe', subState: 'start' },
  ]);
}
