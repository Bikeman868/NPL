import { IContext } from '#interfaces/IContext.js';
import { openScope } from '#interfaces/charsets.js';
import { ParseResult } from './ParseResult.js';

/**
 * Generic parsing of this structure:
 *   <keyword> <identifier> { <scope> }
 *
 * Assumes that the cursor is at the { and moves it to the first character of
 * the scope definition. Changes the sub-scope to 'definition'
 */
export function parseScope(context: IContext): ParseResult {
  context.buffer.skipCount(1);
  context.buffer.skipWhitespace();

  context.setSubState('definition');
  return { text: openScope, tokenType: 'ScopeStart' };
}
