import { IContext } from '#interfaces/IContext.js';
import { ParseResult } from '../functions/ParseResult.js';
import { parseNamedScope } from '../functions/parseNamedScope.js';
import { parseScope } from '../functions/parseScope.js';
import { parseScopeDefinition } from '../functions/parseScopeDefinition.js';

export function parseProcess(context: IContext): ParseResult {
  switch (context.currentState.subState) {
    case 'identifier':
      return parseNamedScope(context, 'process');
    case 'scope':
      return parseScope(context);
    case 'definition':
      return parseProcessDefinition(context);
  }
  throw new Error('Unknown process sub-state ' + context.currentState.subState);
}

function parseProcessDefinition(context: IContext): ParseResult {
  return parseScopeDefinition(context, [
    { keyword: 'accept', state: 'accept', subState: 'identifier' },
  ]);
}