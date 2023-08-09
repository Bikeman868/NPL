import { IContext } from '#interfaces/IContext.js';
import { StateName } from '#interfaces/IParserState.js';
import { ParseResult } from './ParseResult.js';
import { closeScope } from '#interfaces/IParsable.js';

/**
 * Genric parsing of this structure:
 *   {
 *     <keyword> <definition>
 *     <keyword> <definition>
 *     <keyword> <definition>
 *   }
 * Assumes that the cursor is at the first non-whitespace character inside the {}
 * Pops the scope when the closing } is reached
 */
export function parseScopeDefinition(
  context: IContext,
  options: { keyword: string; state?: StateName; subState?: string }[],
): ParseResult {
  if (context.buffer.isEndScope()) {
    context.buffer.skipCount(1);
    context.buffer.skipWhitespace();
    context.popState();
    return { text: closeScope, tokenType: 'ScopeEnd' };
  }

  const keyword = context.buffer.extractToEnd();
  context.buffer.skipWhitespace();

  if (keyword == 'config') {
    if (context.buffer.hasScope()) {
      context.pushState('object', 'scope');
    }
  } else {
    let isValid = false;
    for (let option of options) {
      if (keyword == option.keyword) {
        if (option.state) context.pushState(option.state, option.subState);
        else if (option.subState)
          context.setSubState(option.subState);
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

  return { text: keyword, tokenType: 'Keyword' };
}
