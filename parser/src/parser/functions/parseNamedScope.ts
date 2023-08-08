import { IContext } from '#interfaces/IContext.js';
import { ParseResult } from './ParseResult.js'

// Generic parsing of <keyword> <name> { <definition> }

export function parseNamedScope(
    context: IContext,
    updateContext: boolean,
    keyword: string,
    nextSubState: string,
  ): ParseResult {
    context.buffer.skipSepararator();
    const name = context.buffer.extractToEnd('{');
    if (updateContext) {
      if (context.buffer.hasScope()) {
        context.pushState(undefined, nextSubState);
      } else {
        context.popState();
      }
      if (!name)
        context.syntaxError(
          'Keyword ' +
          keyword +
          ' must be followed by the name of the ' +
          keyword,
        );
    }
    return { text: name, tokenType: 'Identifier' };
  }

