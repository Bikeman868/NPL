import { IContext } from '#interfaces/IContext.js';
import { 
  closeScope, 
  openScope, 
  qualifiedIdentifier, 
  separator, 
  whitespace, 
  keyword as keywordCharset} from '#interfaces/charsets.js';
import { ParseResult } from './ParseResult.js';

/**
 * Generic parsing of any of these options:
 *   <keyword> { <keyword> <identifier> }

 *   <keyword> <keyword> <identifier>
 *
 *   <keyword> { 
 *     <keyword> <identifier>
 *     <keyword> <identifier>
 *     <keyword> <identifier>
 *   }

 * Parsing should start in the 'start' sub-scope with the
 * cursor on the first non-whitespace character after the initial keyword.
 * Under the cursor will either be the first keyword in the list or open {
 */
export function parseScopedList(context: IContext, validKeywords: string[]): ParseResult {
  switch (context.currentState.subState) {
    case 'start':
      return parseScopeStart(context, validKeywords);
    case 'scopedKeyword':
      return parseScopedKeyword(context, validKeywords);
    case 'scopedIdentifier':
      return parseScopedIdentifier(context, validKeywords);
    case 'scopedKeyword':
      return parseKeyword(context, validKeywords);
    case 'identifier':
      return parseIdentifier(context, validKeywords);
  }
  throw new Error('Unknown scoped list sub-state ' + context.currentState.subState);
}

function parseScopeStart(context: IContext, validKeywords: string[]): ParseResult {
  if (context.buffer.peek(1) == openScope) {
    context.buffer.skipCount(1);
    context.buffer.skipAny(whitespace);
    context.setSubState('scopedKeyword');
    return { tokenType: 'ScopeStart', text: openScope }
  }

  return parseKeyword(context, validKeywords);
}

function parseScopedKeyword(context: IContext, validKeywords: string[]): ParseResult {
  if (context.buffer.peek(1) == closeScope) {
    context.buffer.skipCount(1);
    context.buffer.skipAny(whitespace);
    context.popState()
    return { tokenType: 'ScopeEnd', text: closeScope }
  }

  const keyword = context.buffer.extractAny(keywordCharset);
  checkKeyword(keyword, context, validKeywords);

  context.buffer.skipAny(separator);
  context.setSubState('scopedIdentifier')
  return { tokenType: 'Keyword', text: keyword }
}

function parseScopedIdentifier(context: IContext, validKeywords: string[]): ParseResult {
  const identifier = context.buffer.extractAny(qualifiedIdentifier);
  if (!identifier) throw new Error('Expecting a qualified identifier');

  context.buffer.skipAny(whitespace);
  context.setSubState('scopedKeyword');
  return { tokenType: 'QualifiedIdentifier', text: identifier }
}

function parseKeyword(context: IContext, validKeywords: string[]): ParseResult {
  const keyword = context.buffer.extractAny(keywordCharset);
  checkKeyword(keyword, context, validKeywords);

  context.buffer.skipAny(separator);
  context.setSubState('identifier')
  return { tokenType: 'Keyword', text: keyword }
}

function parseIdentifier(context: IContext, validKeywords: string[]): ParseResult {
  const identifier = context.buffer.extractAny(qualifiedIdentifier);
  if (!identifier) throw new Error('Expecting a qualified identifier');

  context.buffer.skipAny(whitespace);
  context.popState();
  return { tokenType: 'QualifiedIdentifier', text: identifier }
}

function checkKeyword(keyword: string, context: IContext, validKeywords: string[]) {
  if (validKeywords.includes(keyword)) return;

  let msg = 'Expecting ';
  for (let i = 0; i < validKeywords.length; i++) {
    const validKeyword = validKeywords[i];
    if (i > 0 && i == validKeywords.length - 1) msg += ' or ';
    else if (i > 0) msg += ', ';
    msg += '"' + validKeyword + '"';
  }
  if (keyword) msg += ' but found "' + keyword + '"';
  else
    msg += ' but found "' + context.buffer.extractToAny(whitespace) + '"';
  context.syntaxError(msg);
}