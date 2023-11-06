import { IContext } from '#interfaces/IContext.js';
import { ParseResult } from '../functions/ParseResult.js';
import { parseScope } from '../functions/parseScope.js';
import { parseScopeDefinition } from '../functions/parseScopeDefinition.js';
import { parseNamedDefinition } from '../functions/parseNamedDefinition.js';

export function parseProcess(context: IContext): ParseResult {
  switch (context.currentState.subState) {
    case 'start':
      return parseNamedDefinition(context, 'accept');
    case 'scope':
      return parseScope(context);
    case 'definition':
      return parseProcessDefinition(context);
  }
  throw new Error('Unknown process sub-state ' + context.currentState.subState);
}

function parseProcessDefinition(context: IContext): ParseResult {
  return parseScopeDefinition(context, [
    { keyword: 'accept', state: 'processAccept' },
    { keyword: 'test', state: 'object' }, // TODO: Test is not an object
  ]);
}
