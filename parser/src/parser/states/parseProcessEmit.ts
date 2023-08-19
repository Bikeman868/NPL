import { IContext } from '#interfaces/IContext.js';
import { ParseResult } from '../functions/ParseResult.js';
import { parseNamedReference } from '../functions/parseNamedReference.js';
import { parseScope } from '../functions/parseScope.js';
import { parseScopeDefinition } from '../functions/parseScopeDefinition.js';

export function parseProcessEmit(context: IContext): ParseResult {
  switch (context.currentState.subState) {
    case 'start':
      return parseNamedReference(context, 'emit');
    case 'scope':
      return parseScope(context);
    case 'definition':
      return parseEmitDefinition(context);
  }
  throw new Error('Unknown emit sub-state ' + context.currentState.subState);
}

function parseEmitDefinition(context: IContext): ParseResult {
  return parseScopeDefinition(context, [
    { keyword: 'data', state: 'object' },
    { keyword: 'context', state: 'object' }, // TODO: Context is not an object
    { keyword: 'route', state: 'object' }, // TODO: Route is not an object
  ]);
}
