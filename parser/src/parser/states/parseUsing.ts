import { IContext } from '#interfaces/IContext.js';
import { ParseResult } from '../functions/ParseResult.js';
import { qualifiedIdentifier } from '#interfaces/charsets.js';

export function parseUsing(context: IContext): ParseResult {
  const text = context.buffer.extractAny(qualifiedIdentifier);
  context.buffer.skipToEol();
  context.buffer.skipWhitespace();

  if (!text)
    context.syntaxError('Using keyword must be followed by a namespace name');

  context.popState();

  return { text, tokenType: 'QualifiedIdentifier' };
}
