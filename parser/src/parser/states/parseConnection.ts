import { IContext } from '#interfaces/IContext.js';
import { ParseResult } from '../functions/ParseResult.js';
import { parseNamedScope } from '../functions/parseNamedScope.js';
import { parseScope } from '../functions/parseScope.js';
import { parseScopeDefinition } from '../functions/parseScopeDefinition.js';
import { openScope } from '#interfaces/IParsable.js';

export function parseConnection(context: IContext): ParseResult {
  switch (context.currentState.subState) {
    case 'identifier':
      return parseNamedScope(context, 'connection');
    case 'scope':
      return parseScope(context);
    case 'definition':
      return parseConnectionDefinition(context);
    case 'kind':
      return parseConnectionKind(context);
  }
  throw new Error(
    'Unknown connection sub-state ' + context.currentState.subState,
  );
}

function parseConnectionDefinition(context: IContext): ParseResult {
  return parseScopeDefinition(context, [
    { keyword: 'ingress', subState: 'kind' },
    { keyword: 'egress', subState: 'kind' },
  ]);
}

function parseConnectionKind(context: IContext): ParseResult {
  const keyword = context.buffer.extractToEnd(openScope);
  context.buffer.skipSepararator();

  if (keyword == 'ingress' || keyword == 'egress') {
    return { text: keyword, tokenType: 'Keyword' };
  }

  context.buffer.skipToEol();
  context.buffer.skipWhitespace();

  return { text: keyword, tokenType: 'Identifier' };
}
