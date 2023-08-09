import { IContext } from '#interfaces/IContext.js';
import { StateName } from '#interfaces/IParserState.js';
import { openScope, closeScope, eol } from '#interfaces/IParsable.js';
import { ParseResult } from './ParseResult.js';

// Generic parsing of the opening { in `<keyword> <name> { <definition> }`

export function parseScope(
  context: IContext,
  updateContext: boolean,
): ParseResult {
  if (updateContext) context.currentState.subState = 'definition';
  return { text: openScope, tokenType: 'ScopeStart' };
}
