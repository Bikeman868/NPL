import { IContext } from '#interfaces/IContext.js';
import { ParseResult } from '../functions/ParseResult.js';
import { parseExpression } from './parseExpression.js';
import { parseScope } from '../functions/parseScope.js';
import { parsePipeRoute } from './parsePipeRoute.js';

/*
 * Parses if, elseif and while statements that follow the pattern
 *   <conditional> <expression> { <scope-block> }
 * Assumes the the cursor is initially positioned at the first character of the expression
 */
export function parsePipeConditional(context: IContext): ParseResult {
  switch (context.currentState.subState) {
    case 'start':
      context.setSubState('scope');
      context.pushState('expression', 'start');
      return parseExpression(context);
    case 'scope':
      return parseScope(context);
    case 'definition':
      context.setState('pipeRoute', 'start')
      return parsePipeRoute(context);
  }
  throw new Error('Unknown pipe conditional sub-state ' + context.currentState.subState);
}
