import { IContext } from '#interfaces/IContext.js';
import { openScope, whitespace } from '#interfaces/charsets.js';
import { ParseResult } from './ParseResult.js';

/**
 * Generic parsing of this structure:
 *   ( <expression>, <expression> )
 *
 * Assumes that the cursor is at the first character of the first expression.
 * Expressions can include nested (). Pops the state when unbalanced closing ) is encountered.
 */
export function parseParams(context: IContext): ParseResult {
  // context.buffer.skipCount(1);
  // context.buffer.skipAny(whitespace);

  // context.setSubState('definition');
  return { text: openScope, tokenType: 'ScopeStart' };
}
