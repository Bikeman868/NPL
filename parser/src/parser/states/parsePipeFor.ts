import { IContext } from '#interfaces/IContext.js';
import { ParseResult } from '../functions/ParseResult.js';
import { newline, separator } from '#interfaces/charsets.js';

/*
 * Parses for statement that follows one of the following patterns
 *   for <identifier> in <expression> { <scope-block> }
 *   for <identifier> of <expression> { <scope-block> }
 * Assumes the the cursor is initially positioned at the first character of the identifier
 */
export function parsePipeFor(context: IContext): ParseResult {
  const text = context.buffer.extractToEol();
  if (!text) context.syntaxError('Computed expression expected');
  context.popState();
  return { text, tokenType: 'Expression' };
}
