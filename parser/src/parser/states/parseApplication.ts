import { IContext } from '#interfaces/IContext.js';
import { ParseResult } from '../functions/ParseResult.js';
import { parseNamedScope } from '../functions/parseNamedScope.js';
import { parseScope } from '../functions/parseScope.js';
import { parseScopeDefinition } from '../functions/parseScopeDefinition.js';

export function parseApplication(
  context: IContext,
  updateContext: boolean,
): ParseResult {
  switch (context.currentState.subState) {
    case 'identifier':
      return parseApplicationIdentifier(context, updateContext);
    case 'scope':
      return parseScope(context, updateContext);
    case 'definition':
      return parseApplicationDefinition(context, updateContext);
  }
  throw new Error(
    'Unknown application sub-state ' + context.currentState.subState,
  );
}

function parseApplicationIdentifier(
  context: IContext,
  updateContext: boolean,
): ParseResult {
  return parseNamedScope(context, updateContext, 'application');
}

function parseApplicationDefinition(
  context: IContext,
  updateContext: boolean,
): ParseResult {
  return parseScopeDefinition(context, updateContext, [
    { keyword: 'connection', state: 'connection', subState: 'identifier' },
  ]);
}
