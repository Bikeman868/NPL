import { IContext } from '#interfaces/IContext.js';
import { ParseResult } from '../functions/ParseResult.js';
import { newline, separator } from '#interfaces/charsets.js';

/*
 * Parses else statements that follow the pattern
 *   else { <scope-block> }
 * Assumes the the cursor is initially positioned at the open { or end of line
 */
export function parsePipeElse(context: IContext): ParseResult {
  const text = context.buffer.extractToEol();
  if (!text) context.syntaxError('Computed expression expected');
  context.popState();
  return { text, tokenType: 'Expression' };
}
