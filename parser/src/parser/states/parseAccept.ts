import { IContext } from '#interfaces/IContext.js';
import { ParseResult } from '../functions/ParseResult.js';
import { parseNamedScope } from '../functions/parseNamedScope.js';
import { parseScope } from '../functions/parseScope.js';
import { parseScopeDefinition } from '../functions/parseScopeDefinition.js';

export function parseAccept(context: IContext): ParseResult {
  switch (context.currentState.subState) {
    case 'identifier':
      return parseNamedScope(context, 'accept');
    case 'scope':
      return parseScope(context);
    case 'definition':
      return parseAcceptDefinition(context);
  }
  throw new Error('Unknown accept sub-state ' + context.currentState.subState);
}

function parseAcceptDefinition(context: IContext): ParseResult {
  return parseScopeDefinition(context, [
    { keyword: 'emit', state: 'emit', subState: 'identifier' },
  ]);
}