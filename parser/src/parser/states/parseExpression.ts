import { IContext } from '#interfaces/IContext.js';
import { ParseResult } from '../functions/ParseResult.js';
import { newline, separator } from '#interfaces/charsets.js';

/*
 * Parses a mathematical expression up to eol, closing } or unbalanced closing )
 * Syntax error if more opening than closing ()
 * Supports unary and binary operations, qualified identifiers and method calls with parameters
*/
export function parseExpression(context: IContext): ParseResult {
  const text = context.buffer.extractToEol();
  if (!text) context.syntaxError('Computed expression expected');
  context.popState();
  return { text, tokenType: 'Expression' };
}
