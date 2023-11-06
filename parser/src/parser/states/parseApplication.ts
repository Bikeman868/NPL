import { IContext } from '#interfaces/IContext.js';
import { ParseResult } from '../functions/ParseResult.js';
import { parseNamedDefinition } from '../functions/parseNamedDefinition.js';
import { parseScope } from '../functions/parseScope.js';
import { parseScopeDefinition } from '../functions/parseScopeDefinition.js';

export function parseApplication(context: IContext): ParseResult {
  switch (context.currentState.subState) {
    case 'start':
      return parseNamedDefinition(context, 'application');
    case 'scope':
      return parseScope(context);
    case 'definition':
      return parseApplicationDefinition(context);
  }
  throw new Error(
    'Unknown application sub-state ' + context.currentState.subState,
  );
}

function parseApplicationDefinition(context: IContext): ParseResult {
  return parseScopeDefinition(context, [
    { keyword: 'connection', state: 'connection' },
  ]);
}
