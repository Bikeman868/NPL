import { IContext } from '#interfaces/IContext.js';
import { ParseResult } from '../functions/ParseResult.js';
import { parseNamedScope } from '../functions/parseNamedScope.js';
import { parseScope } from '../functions/parseScope.js';
import { parseScopeDefinition } from '../functions/parseScopeDefinition.js';

export function parseDestination(context: IContext): ParseResult {
  switch (context.currentState.subState) {
    case 'identifier':
      return parseNamedScope(
        context,
        '',
        'Route destination keywords must be followed by the destination identifier',
      );
    case 'scope':
      return parseScope(context);
  }
  throw new Error(
    'Unknown destination sub-state ' + context.currentState.subState,
  );
}
