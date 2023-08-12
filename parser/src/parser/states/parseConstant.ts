import { IContext } from '#interfaces/IContext.js';
import { ParseResult } from '../functions/ParseResult.js';
import { cr, separator } from '#interfaces/charsets.js';

export function parseExpression(context: IContext): ParseResult {
  context.buffer.skipAny(separator);
  const text = context.buffer.extractToAny([cr]);
  if (!text) context.syntaxError('Constant expression expected');
  context.popState();
  return { text, tokenType: 'Constant' };
}
