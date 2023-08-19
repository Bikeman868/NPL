import { IContext } from '#interfaces/IContext.js';
import { ParseResult } from '../functions/ParseResult.js';
import {
  type Charset,
  openScope,
  closeScope,
  openArgs,
  closeArgs,
  newline,
  symbol,
  whitespace,
  digit,
  floatDigit,
  singleQuote,
  doubleQuote,
  backQuote,
  identifier,
  qualifiedIdentifier,
  stringDelimiter,
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
  throw new Error(
    'Unknown expression sub-state ' + context.currentState.subState,
  );
}

// Start of parsing an expression
function parseStart(context: IContext): ParseResult {
  let ch = context.buffer.peek(1);

  if (ch == openArgs) {
    context.buffer.skipCount(1);
    context.buffer.skipAny(whitespace);
    context.setSubState('startScoped');
    return { tokenType: 'OpenParenthesis', text: openArgs };
  }

  if (expressionEndDelimiters.includes(ch)) {
    context.popState();
    return { tokenType: 'None', text: '' };
  }

  context.setSubState('startUnscoped');
  return parseStartUnscoped(context);
}

// Start parsing an expression that is enclosed in ()
function parseStartScoped(context: IContext): ParseResult {
  let ch = context.buffer.peek(1);

  if (ch == closeArgs) {
    context.buffer.skipCount(1);
    context.buffer.skipAny(whitespace);
    context.popState();
    return { tokenType: 'CloseParenthesis', text: closeArgs };
  }

  context.setSubState('scoped');
  return parse(context, true);
}

// Start parsing expression that ends at the end of the line or the begining of a scope block
function parseStartUnscoped(context: IContext): ParseResult {
  let ch = context.buffer.peek(1);

  if (expressionEndDelimiters.includes(ch)) {
    context.popState();
    return { tokenType: 'None', text: '' };
  }

  context.setSubState('unscoped');
  return parse(context, false);
}

// General parsing of next element in the expression
function parse(context: IContext, scoped: boolean): ParseResult {
  let ch = context.buffer.peek(1);

  if (ch == openArgs) {
    context.buffer.skipCount(1);
    context.buffer.skipAny(whitespace);
    context.pushSubState('startScoped');
    return { tokenType: 'OpenParenthesis', text: ch };
  }

  if (scoped) {
    if (ch == closeArgs) {
      context.buffer.skipCount(1);
      context.buffer.skipAny(whitespace);
      context.popState();
      return { tokenType: 'CloseParenthesis', text: ch };
    }
  } else {
    if (expressionEndDelimiters.includes(ch)) {
      context.popState();
      return { tokenType: 'None', text: '' };
    }
  }

  if (ch == closeArgs || (!scoped && expressionEndDelimiters.includes(ch))) {
    context.buffer.skipCount(1);
    context.buffer.skipAny(whitespace);
    context.popState();
    return scoped
      ? { tokenType: 'CloseParenthesis', text: closeArgs }
      : { tokenType: 'None', text: '' };
  }

  const result: ParseResult = { tokenType: 'None', text: '' };

  if (is(ch, symbol)) {
    result.tokenType = 'Operator';
    result.text = context.buffer.extractAny(symbol);
  } else if (is(ch, digit)) {
    result.tokenType = 'Number';
    result.text = context.buffer.extractAny(floatDigit);
  } else if (is(ch, stringDelimiter)) {
    context.buffer.skipCount(1);
    result.tokenType = 'String';
    result.text = context.buffer.extractString(ch);
  } else if (is(ch, identifier)) {
    result.tokenType = 'QualifiedIdentifier';
    result.text = context.buffer.extractAny(qualifiedIdentifier);
    if (result.text == 'true' || result.text == 'false')
      result.tokenType = 'Boolean';
  } else {
    context.syntaxError(`Unrecognized character in expression "${ch}"`);
  }

  context.buffer.skipAny(whitespace);
  return result;
}

function is(char: string, charset: Charset): boolean {
  for (const ch of charset) if (ch == char) return true;
  return false;
}
