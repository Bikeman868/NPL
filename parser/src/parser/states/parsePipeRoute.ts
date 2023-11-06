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
    { keyword: 'append', state: 'pipeAppend' },
    { keyword: 'prepend', state: 'pipePrepend' },
    { keyword: 'clear', state: 'pipeClear' },
    { keyword: 'capture', state: 'pipeCapture' },
    { keyword: 'remove', state: 'pipeRemove' },
    { keyword: 'if', state: 'pipeIf' },
    { keyword: 'else', state: 'pipeElse' },
    { keyword: 'elseif', state: 'pipeElseif' },
    { keyword: 'while', state: 'pipeWhile' },
    { keyword: 'for', state: 'pipeFor' },
  ]);
}
