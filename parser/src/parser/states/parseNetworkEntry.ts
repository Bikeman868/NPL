import { IContext } from '#interfaces/IContext.js';
import { ParseResult } from '../functions/ParseResult.js';
import { parseScope } from '../functions/parseScope.js';
import { parseQualifiedDefinition } from '../functions/parseQualifiedDefinition.js';
import { parseScopeDefinition } from '../functions/parseScopeDefinition.js';
import { whitespace, qualifiedIdentifier, openScope } from '#interfaces/charsets.js';

export function parseNetworkEntry(context: IContext): ParseResult {
  switch (context.currentState.subState) {
    case 'identifier':
      return parseQualifiedDefinition(context, [
        'ingress',
        'egress',
        'default',
        'network',
      ]);
    case 'scope':
      return parseScope(context);
    case 'definition':
      return parseEntrypointDefinition(context);
    case 'destination':
      return parseEntrypointDestination(context);
  }
  throw new Error(
    'Unknown entrypoint sub-state ' + context.currentState.subState,
  );
}

function parseEntrypointDefinition(context: IContext): ParseResult {
  return parseScopeDefinition(context, [
    { keyword: 'pipe', subState: 'destination' },
    { keyword: 'network', subState: 'destination' },
    { keyword: 'process', subState: 'destination' },
  ]);
}

function parseEntrypointDestination(context: IContext): ParseResult {
  if (context.buffer.isBeginScope()) {
    context.syntaxError(
      `Network entry points can not define routing or configuration, direct messages to a pipe instead`);
    return { text: openScope, tokenType: 'ScopeStart' };
  }

  const destination = context.buffer.extractAny(qualifiedIdentifier);
  if (!destination)
    context.syntaxError(`Expecting a reference to a pipe, network or process`);

  context.buffer.skipAny(whitespace);
  context.setSubState('definition');

  return { text: destination, tokenType: 'QualifiedIdentifier' };
}
