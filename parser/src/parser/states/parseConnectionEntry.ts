import { IContext } from '#interfaces/IContext.js';
import { openScope } from '#interfaces/charsets.js';
import { ParseResult } from '../functions/ParseResult.js';
import { parseQualifiedReference } from '../functions/parseQualifiedReference.js';

export function parseConnectionEntry(context: IContext): ParseResult {
  switch (context.currentState.subState) {
    case 'start':
      return parseQualifiedReference(context, ['ingress', 'egress', 'network']);
    case 'scope':
      return parseEntryScope(context);
  }
  throw new Error(
    'Unknown entrypoint sub-state ' + context.currentState.subState,
  );
}

function parseEntryScope(context: IContext): ParseResult {
  context.syntaxError('Connection ingress/egress can only be connected to one network entry point');
  return { text: openScope, tokenType: 'ScopeStart' }
}
