import { IContext } from '#interfaces/IContext.js';
import { StateName } from '#interfaces/IParserState.js';
import { openScope, closeScope, eol } from '#interfaces/IParsable.js';
import { ParseResult } from './ParseResult.js';

/**
 * Generic parsing of this structure:
 *   <keyword> <identifier> { <scope> }
 * Assumes that the cursor is at the opening {
 */
export function parseScope(context: IContext): ParseResult {
  context.buffer.skipCount(1);
  context.buffer.skipWhitespace();

  context.setSubState('definition');
  return { text: openScope, tokenType: 'ScopeStart' };
}
