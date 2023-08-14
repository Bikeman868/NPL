import { IContext } from '#interfaces/IContext.js';
import { ParseResult } from '../functions/ParseResult.js';
import { parseScope } from '../functions/parseScope.js';
import { parseScopeDefinition } from '../functions/parseScopeDefinition.js';
import { parseNamedDefinition } from '../functions/parseNamedDefinition.js';

export function parsePipe(context: IContext): ParseResult {
  switch (context.currentState.subState) {
    case 'identifier':
      return parseNamedDefinition(context, 'accept');
    case 'scope':
      return parseScope(context);
    case 'definition':
      return parsePipeDefinition(context);
  }
  throw new Error('Unknown process sub-state ' + context.currentState.subState);
}

function parsePipeDefinition(context: IContext): ParseResult {
  return parseScopeDefinition(context, [
    { keyword: 'route', state: 'pipeRoute', subState: 'identifier' },
  ]);
}
