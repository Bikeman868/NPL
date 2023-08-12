import { IContext } from '#interfaces/IContext.js';
import { parseNamedReference } from '../functions/parseNamedReference.js';
import { ParseResult } from '../functions/ParseResult.js';
import { parseScope } from '../functions/parseScope.js';

export function parseRoute(context: IContext): ParseResult {
  switch (context.currentState.subState) {
    case 'identifier':
      return parseNamedReference(
        context,
        '',
        'Destination type must be followed by the destination identifier',
      );
    case 'scope':
      return parseScope(context);
  }
  throw new Error('Unknown route sub-state ' + context.currentState.subState);
}
