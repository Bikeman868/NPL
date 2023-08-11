import { IContext } from '#interfaces/IContext.js';
import { ParseResult } from '../functions/ParseResult.js';
import { cr } from '#interfaces/charsets.js';

export function parseExpression(context: IContext): ParseResult {
  context.buffer.skipSepararator();
  const text = context.buffer.extractToAny([cr]);
  if (!text) context.syntaxError('Computed expression expected');
  context.popState();
  return { text, tokenType: 'Expression' };
}
