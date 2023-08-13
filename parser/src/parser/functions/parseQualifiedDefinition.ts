import { IContext } from '#interfaces/IContext.js';
import { ParseResult } from './ParseResult.js';
import {
  openScope,
  identifier,
  whitespace,
  separator,
} from '#interfaces/charsets.js';

/**
 * Generic parsing of this structure:
 *   <keyword> <qualifier>...<qualifier> <identifier> { <scope> }
 *
 * Assumes that the cursor is at the first character of the first qualifier or the identifier
 * Assumes that the keyword token already pushed a new scope
 * The scope and identifier are both optional
 * When the identifier is present, transitions to next state in 'scope' sub-state with the cursor on {}
 * When scope is present, transitions to 'definition' sub-state with the cursor on the begining of the scope
 * When no scope present, pops the state and leaves the curson on whatever comes next
 */
export function parseQualifiedDefinition(
  context: IContext,
  qualifiers: string[],
): ParseResult {
  const qualifierOrIdentifier = context.buffer.extractAny(identifier);
  context.buffer.skipAny(separator);

  // Optional qualifiers
  if (qualifiers.includes(qualifierOrIdentifier)) {
    return { text: qualifierOrIdentifier, tokenType: 'Keyword' };
  }

  // Optional identifier
  if (qualifierOrIdentifier) {
    if (context.buffer.hasScope()) {
      context.setSubState('scope');
    } else {
      context.buffer.skipAny(whitespace);
      context.popState();
    }
    return { text: qualifierOrIdentifier, tokenType: 'Identifier' };
  }

  // Optional scope block
  if (context.buffer.hasScope()) {
    context.buffer.skipCount(1);
    context.buffer.skipAny(whitespace);
    context.setSubState('definition');
    return { text: openScope, tokenType: 'ScopeStart' };
  }

  context.buffer.skipAny(whitespace);
  context.popState();
  return { text: '', tokenType: 'Identifier' };
}
