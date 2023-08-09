import { IContext } from '#interfaces/IContext.js';
import { ParseResult } from '../functions/ParseResult.js';
import { parseNamedScope } from '../functions/parseNamedScope.js';
import { parseScope } from '../functions/parseScope.js';
import { parseScopeDefinition } from '../functions/parseScopeDefinition.js';

export function parseRoute(
  context: IContext,
  updateContext: boolean,
): ParseResult {
  switch (context.currentState.subState) {
    case 'destination':
      return parseDestinationIdentifier(context, updateContext);
    case 'scope':
      return parseScope(context, updateContext);
    case 'definition':
      return parseRouteDefinition(context, updateContext);
  }
  throw new Error(
    'Unknown route sub-state ' + context.currentState.subState,
  );
}

function parseRouteDefinition(
  context: IContext,
  updateContext: boolean,
): ParseResult {
  return parseScopeDefinition(context, updateContext, [
    { keyword: 'process', subState: 'destination' },
    { keyword: 'pipe', subState: 'destination' },
    { keyword: 'network', subState: 'destination' },
  ]);
}

function parseDestinationIdentifier(
  context: IContext,
  updateContext: boolean,
): ParseResult {
  const text = context.buffer.extractToEnd();
  context.buffer.skipToEol();
  context.buffer.skipWhitespace();
  // TODO: destinations can contain route.xxx commands
  if (updateContext) context.currentState.subState = 'definition';
  return { text, tokenType: 'Identifier' }
}
