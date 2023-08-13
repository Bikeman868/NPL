import { IContext } from '#interfaces/IContext.js';
import { parseScopeDefinition } from '../functions/parseScopeDefinition.js';
import { parseNamedReference } from '../functions/parseNamedReference.js';
import { ParseResult } from '../functions/ParseResult.js';
import { parseScope } from '../functions/parseScope.js';

export function parseRoute(context: IContext): ParseResult {
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
    { keyword: 'route.append', state: 'appendRoute', subState: 'scope' },
    { keyword: 'route.prepend', state: 'prependRoute', subState: 'scope' },
    { keyword: 'route.clear', state: 'clearRoute', subState: 'scope' },
    { keyword: 'route.capture', state: 'captureRoute', subState: 'scope' },
    { keyword: 'route.remove', state: 'removeRoute', subState: 'scope' },
    { keyword: 'if', state: 'ifRoute', subState: 'scope' },
    { keyword: 'else', state: 'elseRoute', subState: 'scope' },
    { keyword: 'elseif', state: 'elseifRoute', subState: 'scope' },
  ]);
}
