import { IContext } from '#interfaces/IContext.js';
import { StateName } from '#interfaces/IParserState.js';
import { ParseResult } from './ParseResult.js'

// Genric parsing of the contents of {}

export function parseScopeDefinition(
  context: IContext,
  updateContext: boolean,
  options: { keyword: string; state?: StateName, subState?: string }[],
): ParseResult {
  context.buffer.skipWhitespace();
  const text = context.buffer.extractToEnd();

  if (updateContext) {
    if (text == 'config') {
      if (context.buffer.hasScope()) context.pushState('object', '');
    } else {
      let isValid = false;
      for (let option of options) {
        if (text == option.keyword) {
          context.pushState(option.state, option.subState || '');
          isValid = true;
          break;
        }
      }
      if (!isValid) {
        let msg = 'Expecting one of `config`';
        for (var i = 0; i < options.length; i++) {
          msg += ', `' + options[i].keyword + '`';
        }
        msg += ' but found `' + text + `'`;
        context.syntaxError(msg);
      }
    }
  }

  return { text, tokenType: 'Keyword' };
}
