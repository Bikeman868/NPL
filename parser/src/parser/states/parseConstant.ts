import { IContext } from '#interfaces/IContext.js';
import { ParseResult } from '../functions/ParseResult.js';
import { eol } from '#interfaces/IParsable.js';

export function parseExpression(
  context: IContext,
  updateContext: boolean,
): ParseResult {
  context.buffer.skipSepararator();
  const text = context.buffer.extractToAny([eol]);
  if (updateContext) {
    if (!text) context.syntaxError('Constant expression expected');
    context.popState();
  }
  return { text, tokenType: 'Constant' };
}
