import { IContext } from '#interfaces/IContext.js';
import { ParseResult } from '../functions/ParseResult.js';
import { parseNamedScope } from '../functions/parseNamedScope.js';
import { parseScope } from '../functions/parseScope.js';
import { parseScopeDefinition } from '../functions/parseScopeDefinition.js';

export function parseEmit(context: IContext): ParseResult {
  switch (context.currentState.subState) {
    case 'identifier':
      return parseNamedScope(context, 'emit');
    case 'scope':
      return parseScope(context);
    case 'definition':
      return parseEmitDefinition(context);
  }
  throw new Error('Unknown emit sub-state ' + context.currentState.subState);
}

function parseEmitDefinition(context: IContext): ParseResult {
  // TODO: Only data is an object
  return parseScopeDefinition(context, [
    { keyword: 'data', state: 'object', subState: 'scope' },
    { keyword: 'context', state: 'object', subState: 'scope' },
    { keyword: 'route', state: 'object', subState: 'scope' },
  ]);
}
