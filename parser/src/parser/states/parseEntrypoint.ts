import { IContext } from '#interfaces/IContext.js';
import { ParseResult } from '../functions/ParseResult.js';
import { parseScope } from '../functions/parseScope.js';
import { parseQualifiers } from '../functions/parseQualifiers.js';
import { parseScopeDefinition } from '../functions/parseScopeDefinition.js';

export function parseEntrypoint(context: IContext): ParseResult {
  switch (context.currentState.subState) {
    case 'identifier':
      return parseQualifiers(context, ['ingress', 'egress', 'default']);
    case 'scope':
      return parseScope(context);
    case 'definition':
      return parseEntrypointDefinition(context);
  }
  throw new Error('Unknown entrypoint sub-state ' + context.currentState.subState);
}

function parseEntrypointDefinition(context: IContext): ParseResult {
  return parseScopeDefinition(context, [
    { keyword: 'pipe', state: 'route', subState: 'identifier' },
    { keyword: 'network', state: 'route', subState: 'identifier' },
    { keyword: 'process', state: 'route', subState: 'identifier' },
  ]);
}
