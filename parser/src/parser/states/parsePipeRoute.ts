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
    { keyword: 'append', state: 'pipeAppend', subState: 'scope' },
    { keyword: 'prepend', state: 'pipePrepend', subState: 'scope' },
    { keyword: 'clear', state: 'pipeClear', subState: 'scope' },
    { keyword: 'capture', state: 'pipeCapture', subState: 'identifier' },
    { keyword: 'remove', state: 'pipeRemove', subState: 'identifier' },
    { keyword: 'if', state: 'pipeIf', subState: 'expression' },
    { keyword: 'else', state: 'pipeElse', subState: 'scope' },
    { keyword: 'elseif', state: 'pipeElseif', subState: 'expression' },
    { keyword: 'while', state: 'pipeWhile', subState: 'expression' },
    { keyword: 'for', state: 'pipeFor', subState: 'identifier' },
  ]);
}
