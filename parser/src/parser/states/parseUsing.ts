import { IContext } from '#interfaces/IContext.js';
import { ParseResult } from '../functions/ParseResult.js';

export function parseUsing(context: IContext): ParseResult {
  const text = context.buffer.extractToEnd();
  context.buffer.skipToEol();
  context.buffer.skipWhitespace();

  if (!text)
    context.syntaxError('Using keyword must be followed by a namespace name');

  context.popState();

  return { text, tokenType: 'Identifier' };
}
