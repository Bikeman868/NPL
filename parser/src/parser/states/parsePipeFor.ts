import { IContext } from '#interfaces/IContext.js';
import { ParseResult } from '../functions/ParseResult.js';
import { parseExpression } from './parseExpression.js';

/*
 * Parses for statement that follows one of the following patterns
 *   for <identifier> in <expression> { <scope-block> }
 *   for <identifier> of <expression> { <scope-block> }
 * Assumes the the cursor is initially positioned at the first character of the identifier
 */
export function parsePipeFor(context: IContext): ParseResult {
  // TODO: Parse actual syntax
  if (context.currentState.subState == 'start') {
    context.setSubState('done')
    context.pushState('expression');
    return parseExpression(context);
  }
  context.popState();
  return { tokenType: 'None', text: '' }
}
