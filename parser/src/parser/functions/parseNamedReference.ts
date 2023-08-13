import { IContext } from '#interfaces/IContext.js';
import { ParseResult } from './ParseResult.js';
import { qualifiedIdentifier, whitespace } from '#interfaces/charsets.js';

/**
 * Generic parsing of this structure:
 *   <keyword> <identifier>.<identifier> { <scope> }
 *
 * Assumes that the cursor is at the first character of the identifier
 * Assumes that the keyword token already pushed a new scope
 * The scope is optional.
 * When scope is present, transitions to 'scope' sub-state with the cursor on the {
 * When no scope present, pops the state and leaves the curson on whatever comes next
 */
export function parseNamedReference(
  context: IContext,
  keyword: string,
  customSyntaxError?: string,
): ParseResult {
  const name = context.buffer.extractAny(qualifiedIdentifier);

  if (context.buffer.hasScope()) {
    context.setSubState('scope');
  } else {
    context.buffer.skipAny(whitespace);
    context.popState();
  }
  if (!name)
    context.syntaxError(
      customSyntaxError ||
        `Keyword ${keyword} must be followed by the ${keyword} qualified identifier`,
    );

  return { text: name, tokenType: 'QualifiedIdentifier' };
}
