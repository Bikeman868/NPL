import { IContext } from '#interfaces/IContext.js';
import { ParseResult } from '../functions/ParseResult.js';
import { parseScope } from '../functions/parseScope.js';
import { parseScopeDefinition } from '../functions/parseScopeDefinition.js';

export function parseRoute(context: IContext): ParseResult {
  switch (context.currentState.subState) {
    case 'destination':
      return parseDestinationIdentifier(context);
    case 'scope':
      return parseScope(context);
    case 'definition':
      return parseRouteDefinition(context);
  }
  throw new Error('Unknown route sub-state ' + context.currentState.subState);
}

function parseRouteDefinition(context: IContext): ParseResult {
  return parseScopeDefinition(context, [
    { keyword: 'process', subState: 'destination' },
    { keyword: 'pipe', subState: 'destination' },
    { keyword: 'network', subState: 'destination' },
  ]);
}

function parseDestinationIdentifier(context: IContext): ParseResult {
  const text = context.buffer.extractToEnd();
  context.buffer.skipToEol();
  context.buffer.skipWhitespace();
  // TODO: destinations can contain route.xxx commands
  context.setSubState('definition');
  return { text, tokenType: 'Identifier' };
}
