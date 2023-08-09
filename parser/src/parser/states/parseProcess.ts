import { IContext } from '#interfaces/IContext.js';
import { ParseResult } from '../functions/ParseResult.js';
import { parseNamedScope } from '../functions/parseNamedScope.js';
import { parseScope } from '../functions/parseScope.js';
import { parseScopeDefinition } from '../functions/parseScopeDefinition.js';

export function parseProcess(
  context: IContext,
  updateContext: boolean,
): ParseResult {
  switch (context.currentState.subState) {
    case 'identifier':
      return parseProcessIdentifier(context, updateContext);
    case 'scope':
      return parseScope(context, updateContext);
    case 'definition':
      return parseProcessDefinition(context, updateContext);
  }
  throw new Error('Unknown process sub-state ' + context.currentState.subState);
}

function parseProcessIdentifier(
  context: IContext,
  updateContext: boolean,
): ParseResult {
  return parseNamedScope(context, updateContext, 'process');
}

function parseProcessDefinition(
  context: IContext,
  updateContext: boolean,
): ParseResult {
  return parseScopeDefinition(context, updateContext, [
    { keyword: 'accept', state: 'accept', subState: 'identifier' },
  ]);
}
