import { IContext } from '#interfaces/IContext.js';
import { ParseResult } from '../functions/ParseResult.js';

export function parseUsing(
  context: IContext,
  updateContext: boolean,
): ParseResult {
  context.buffer.skipSepararator();
  const text = context.buffer.extractToEnd();
  context.buffer.skipToEol();
  if (updateContext) {
    if (!text)
      context.syntaxError(
        'Using keyword must be followed by the name of a namespace',
      );
    context.popState();
  }
  return { text, tokenType: 'Identifier' };
}
