import { IContext } from '#interfaces/IContext.js';
import { ParseResult } from '../functions/ParseResult.js';
import { 
  openScope, 
  closeScope, 
  openArgs,
  closeArgs, 
  newline, 
} from '#interfaces/charsets.js';

const expressionEndDelimiters = [closeArgs, openScope, closeScope, newline];

/*
 * Parses a mathematical expression up to eol, opening or closing {} or unbalanced closing )
 * Syntax error if more opening than closing ()
 * Supports unary and binary operations, qualified identifiers and method calls with parameters
 * Parentheses are represented by a nested hierarchy of expressions
*/
export function parseExpression(context: IContext): ParseResult {
  switch (context.currentState.subState) {
    case 'start':
      return parseStart(context);
    case 'startScoped':
      return parseStartScoped(context);
    case 'startUnscoped':
      return parseStartUnscoped(context);
    case 'scoped':
      return parse(context, true);
    case 'unscoped':
      return parse(context, false);
  }
  throw new Error('Unknown expression sub-state ' + context.currentState.subState);
}

function parseStart(context: IContext): ParseResult {
  let ch = context.buffer.peek(1);
  if (ch == openArgs) {
    context.buffer.skipCount(1);
    context.setSubState('startScoped');
    return { tokenType: 'OpenParenthesis', text: openArgs }
  }
  if (expressionEndDelimiters.includes(ch)) {
    context.popState();
    return { tokenType: 'None', text: '' }
  }
  context.pushState(undefined, 'startUnscoped')
  return parseStartUnscoped(context);
}

// Start of an expression that is wrapped in ()
function parseStartScoped(context: IContext): ParseResult {
  let ch = context.buffer.peek(1);
  if (ch == closeArgs) {
    context.buffer.skipCount(1);
    context.popState();
    return { tokenType: 'CloseParenthesis', text: closeArgs }
  }
  return parse(context, true);
}

// Start of an expression that ends at the end of the line
function parseStartUnscoped(context: IContext): ParseResult {
  let ch = context.buffer.peek(1);
  if (ch == closeArgs || ch == closeScope || ch == newline) {
    context.popState();
    return { tokenType: 'None', text: '' }
  }
  return parse(context, false);
}

function parse(context: IContext, scoped: boolean): ParseResult {
  const expression = context.buffer.extractToAny([openArgs, closeArgs, newline])
  
  let ch = context.buffer.peek(1);

  if (ch == openArgs) {
    context.buffer.skipCount(1);
    context.pushState(undefined, 'startScoped')
    return { tokenType: 'OpenParenthesis', text: openArgs }
  }

  if (ch == closeArgs) {
    context.buffer.skipCount(1);
    context.popState();
    return scoped 
      ? { tokenType: 'CloseParenthesis', text: closeArgs } 
      : { tokenType: 'None', text: '' } 
  }

  return { tokenType: 'Expression', text: expression}
}
