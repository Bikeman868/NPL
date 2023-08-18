import { IContext } from '#interfaces/IContext.js';
import { parseScopeDefinition } from '../functions/parseScopeDefinition.js';
import { parseNamedReference } from '../functions/parseNamedReference.js';
import { ParseResult } from '../functions/ParseResult.js';
import { parseScope } from '../functions/parseScope.js';

export function parsePipeRoute(context: IContext): ParseResult {
  switch (context.currentState.subState) {
    case 'start':
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
    { keyword: 'append', state: 'pipeAppend', subState: 'start' },
    { keyword: 'prepend', state: 'pipePrepend', subState: 'start' },
    { keyword: 'clear', state: 'pipeClear', subState: 'start' },
    { keyword: 'capture', state: 'pipeCapture', subState: 'start' },
    { keyword: 'remove', state: 'pipeRemove', subState: 'start' },
    { keyword: 'if', state: 'pipeIf', subState: 'start' },
    { keyword: 'else', state: 'pipeElse', subState: 'start' },
    { keyword: 'elseif', state: 'pipeElseif', subState: 'start' },
    { keyword: 'while', state: 'pipeWhile', subState: 'start' },
    { keyword: 'for', state: 'pipeFor', subState: 'start' },
  ]);
}
