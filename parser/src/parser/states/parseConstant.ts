import { IContext } from '#interfaces/IContext.js';
import { ParseResult } from '../functions/ParseResult.js';
import { separator } from '#interfaces/charsets.js';

export function parseConstant(context: IContext): ParseResult {
  const text = context.buffer.extractToEol();
  if (!text) context.syntaxError('Constant constant expected');
  context.popState();
  return { text, tokenType: 'Constant' };
}
