import { IContext } from '#interfaces/IContext.js';
import { StateName } from '#interfaces/IParserState.js';
import { ParseResult } from './ParseResult.js';
import { closeScope } from '#interfaces/IParsable.js';

// Genric parsing of the definition part of `{ <definition> }`

export function parseScopeDefinition(
  context: IContext,
  updateContext: boolean,
  options: { keyword: string; state?: StateName; subState?: string }[],
): ParseResult {
  if (context.buffer.isEndScope()) {
    return { text: closeScope, tokenType: 'ScopeEnd' };
  }

  const keyword = context.buffer.extractToEnd();
  context.buffer.skipWhitespace();

  if (updateContext) {
    if (keyword == 'config') {
      if (context.buffer.hasScope()) context.pushState('object', 'definition');
    } else {
      let isValid = false;
      for (let option of options) {
        if (keyword == option.keyword) {
          if (option.state)
            context.pushState(option.state, option.subState);
          else if (option.subState)
            context.currentState.subState = option.subState;
          isValid = true;
          break;
        }
      }
      if (!isValid) {
        let msg = 'Expecting one of `config`';
        for (var i = 0; i < options.length; i++) {
          msg += ', `' + options[i].keyword + '`';
        }
        msg += ' but found `' + keyword + `'`;
        context.syntaxError(msg);
      }
    }
  }

  return { text: keyword, tokenType: 'Keyword' };
}
