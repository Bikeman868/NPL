import { IContext } from '#interfaces/IContext.js';
import { ParseResult } from './ParseResult.js';
import { openScope } from '#interfaces/IParsable.js';

/**
 * Generic parsing of this structure:
 *   <keyword> <identifier> { <scope> }
 * 
 * Assumes that the cursor is at the first character of the identifier
 * Assumes that the keyword token already pushed a new scope
 * The scope is optional.
 * When scope is present, transitions to 'scope' sub-state with the cursor on the {
 * When no scope present, pops the state and leaves the curson on whatever comes next
 */
export function parseNamedScope(
  context: IContext,
  keyword: string,
  customSyntaxError?: string,
): ParseResult {
  const name = context.buffer.extractToEnd(openScope);

  if (context.buffer.hasScope()) {
    context.setSubState('scope');
  } else {
    context.buffer.skipWhitespace();
    context.popState();
  }
  if (!name)
    context.syntaxError(customSyntaxError || 
      `Keyword ${keyword} must be followed by the name of the ${keyword}`,
    );

  return { text: name, tokenType: 'Identifier' };
}
