import { IContext } from '#interfaces/IContext.js';
import { openScope, closeScope, whitespace } from '#interfaces/charsets.js';
import { ParseResult } from './ParseResult.js';

/**
 * Generic parsing of this structure:
 *   { <scope> }
 *
 * Assumes that the cursor is at the { and moves it to the first character of
 * the scope definition. Changes the sub-scope to 'definition'
 */
export function parseScope(context: IContext): ParseResult {
  const ch = context.buffer.extractCount(1);
  if (ch != openScope)
    context.syntaxError(`Expecting "${openScope}" but found "${ch}"`);

  context.buffer.skipAny(whitespace);
  context.setSubState('definition');
  return { text: openScope, tokenType: 'ScopeStart' };
}
