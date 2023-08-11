import { IContext } from '#interfaces/IContext.js';
import { StateName } from '#interfaces/IParserState.js';
import { ParseResult } from './ParseResult.js';
import { identifier, whitespace, closeScope } from '#interfaces/charsets.js';

/**
 * Genric parsing of this structure:
 *   {
 *     config <definition>
 *     <keyword> <definition>
 *     <keyword> <definition>
 *     <keyword> <definition>
 *   }
 *
 * Assumes that the cursor is at the first non-whitespace character inside the {}
 * Pops the scope when the closing } is reached. The {} can be empty in which case
 * the cursor should start on the }.
 *
 * For each keyword, pushes a new scope with the cursor at the first character of
 * the definiton. These scope parsers should pop the scope and leave the cursor
 * on the first character of the next keyword.
 *
 * config is an always supported keyword.
 *
 * @param options defines the valid keywords and scope to push or set for each.
 * Leave scope undefined to move to a new sub-scope. Set scope to push that scope
 */
export function parseScopeDefinition(
  context: IContext,
  options: { keyword: string; state?: StateName; subState?: string }[],
): ParseResult {
  if (context.buffer.isEndScope()) {
    // Empty scope block
    context.buffer.skipCount(1);
    context.buffer.skipWhitespace();
    context.popState();
    return { text: closeScope, tokenType: 'ScopeEnd' };
  }

  // Get keyword and skip to definition
  const keyword = context.buffer.extractAny(identifier);
  context.buffer.skipWhitespace();

  if (keyword == 'config') {
    if (context.buffer.hasScope()) {
      context.pushState('object', 'scope');
    }
  } else {
    let isValid = false;
    for (const option of options) {
      if (keyword == option.keyword) {
        if (option.state) context.pushState(option.state, option.subState);
        else if (option.subState) context.setSubState(option.subState);
        isValid = true;
        break;
      }
    }
    if (!isValid) {
      let msg = 'Expecting "config"';
      for (let i = 0; i < options.length; i ++) {
        const option = options[i];
        msg += (i == options.length - 1) ? ' or ' : ', '; 
        msg += '"' + option.keyword + '"';
      }
      if (keyword) msg += ' but found "' + keyword + '"';
      else
        msg += ', but found "' + context.buffer.extractToAny(whitespace) + '"';
      context.syntaxError(msg);
      if (!keyword)
        throw new Error(
          'Non-alpha characters found where keyword was expected',
        );
    }
  }

  return { text: keyword, tokenType: 'Keyword' };
}
