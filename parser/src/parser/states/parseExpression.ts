import { IContext } from '#interfaces/IContext.js';
import { ParseResult } from '../functions/ParseResult.js';
import { closeScope, newline, openScope, closeArgs } from '#interfaces/charsets.js';

/*
 * Parses a mathematical expression up to eol, opening or closing {} or unbalanced closing )
 * Syntax error if more opening than closing ()
 * Supports unary and binary operations, qualified identifiers and method calls with parameters
 * Parentheses are represented by a nested hierarchy of expressions
*/
export function parseExpression(context: IContext): ParseResult {
  const text = context.buffer.extractToAny([newline, openScope, closeScope, closeArgs]);
  if (!text) context.syntaxError('Computed expression expected');
  context.popState();
  return { text, tokenType: 'Expression' };
}
