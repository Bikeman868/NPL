import { IContext } from '#interfaces/IContext.js';
import { parseScopeDefinition } from '../functions/parseScopeDefinition.js';
import { parseNamedReference } from '../functions/parseNamedReference.js';
import { ParseResult } from '../functions/ParseResult.js';
import { parseScope } from '../functions/parseScope.js';

export function parsePipeRoute(context: IContext): ParseResult {
  switch (context.currentState.subState) {
    case 'identifier':
      return parseNamedReference(
        context,
        '',
        'Destination type must be followed by the destination identifier',
      );
    case 'scope':
      return parseScope(context);
    case 'definition':
      return parseRouteDefinition(context);
  }
  throw new Error('Unknown route sub-state ' + context.currentState.subState);
}

function parseRouteDefinition(context: IContext): ParseResult {
  return parseScopeDefinition(context, [
    { keyword: 'append', state: 'appendRoute', subState: 'scope' },
    { keyword: 'prepend', state: 'prependRoute', subState: 'scope' },
    { keyword: 'clear', state: 'clearRoute', subState: 'scope' },
    { keyword: 'capture', state: 'captureRoute', subState: 'scope' },
    { keyword: 'remove', state: 'removeRoute', subState: 'scope' },
    { keyword: 'if', state: 'ifRoute', subState: 'scope' },
    { keyword: 'else', state: 'elseRoute', subState: 'scope' },
    { keyword: 'elseif', state: 'elseifRoute', subState: 'scope' },
  ]);
}
