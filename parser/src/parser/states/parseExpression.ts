import { IContext } from '#interfaces/IContext.js';
import { ParseResult } from '../functions/ParseResult.js';
import { eol } from '#interfaces/IParsable.js';

export function parseExpression(context: IContext): ParseResult {
  context.buffer.skipSepararator();
  const text = context.buffer.extractToAny([eol]);
  if (!text) context.syntaxError('Computed expression expected');
  context.popState();
  return { text, tokenType: 'Expression' };
}
