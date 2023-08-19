import { IContext } from '#interfaces/IContext.js';
import { ParseResult } from '../functions/ParseResult.js';
import { parseScope } from '../functions/parseScope.js';
import { parsePipeRoute } from './parsePipeRoute.js';

/*
 * Parses else statements that follow the pattern
 *   else { <scope-block> }
 * Assumes the the cursor is initially positioned at the open { or end of line
 */
export function parsePipeElse(context: IContext): ParseResult {
  switch (context.currentState.subState) {
    case 'start':
      return parseScope(context);
    case 'definition':
      context.setState('pipeRoute', 'definition')
      return parsePipeRoute(context);
  }
  throw new Error('Unknown pipe else sub-state ' + context.currentState.subState);
}
