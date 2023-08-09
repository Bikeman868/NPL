import { IContext } from '#interfaces/IContext.js';
import { ParseResult } from './ParseResult.js';
import { openScope } from '#interfaces/IParsable.js';

/**
 * Generic parsing of this structure:
 *   <keyword> <identifier> { <scope> }
 * Assumes that the cursor is at the first character of the identifier
 * The scope is optional. When present, transitions to 'scope' sub-state. When not present
 * pops the context state
 */
export function parseNamedScope(
  context: IContext,
  keyword: string,
): ParseResult {
  const name = context.buffer.extractToEnd(openScope);

  if (context.buffer.hasScope()) {
    context.setSubState('scope');
  } else {
    context.popState();
  }
  if (!name)
    context.syntaxError(
      `Keyword ${keyword} must be followed by the name of the ${keyword}`,
    );

  return { text: name, tokenType: 'Identifier' };
}
