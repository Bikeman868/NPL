import { IContext } from '#interfaces/IContext.js';
import { ParseResult } from './ParseResult.js';
import { openScope } from '#interfaces/IParsable.js'

// Generic parsing of the name part of `<keyword> <name> { <definition> }`

export function parseNamedScope(
  context: IContext,
  updateContext: boolean,
  keyword: string,
): ParseResult {
  const name = context.buffer.extractToEnd(openScope);
  context.buffer.skipSepararator()
  if (updateContext) {
    if (context.buffer.hasScope()) {
      context.currentState.subState = 'scope';
    } else {
      context.popState();
    }
    if (!name)
      context.syntaxError(`Keyword ${keyword} must be followed by the name of the ${keyword}`,
      );
  }
  return { text: name, tokenType: 'Identifier' };
}
