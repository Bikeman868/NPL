import { IContext } from '#interfaces/IContext.js';
import { ParseResult } from '../functions/ParseResult.js';
import { parseNamedDefinition } from '../functions/parseNamedDefinition.js';
import { parseScope } from '../functions/parseScope.js';
import {
  identifier,
  whitespace,
  closeScope,
  separator,
} from '#interfaces/charsets.js';

export function parseEnum(context: IContext): ParseResult {
  switch (context.currentState.subState) {
    case 'start':
      return parseNamedDefinition(context, 'message');
    case 'scope':
      return parseScope(context);
    case 'definition':
      return parseEnumDefinition(context);
  }
  throw new Error('Unknown enum sub-state ' + context.currentState.subState);
}

function parseEnumDefinition(context: IContext): ParseResult {
  if (context.buffer.isEndScope()) {
    context.buffer.skipCount(1);
    context.buffer.skipAny(whitespace);
    context.popState();
    return { text: closeScope, tokenType: 'ScopeEnd' };
  } else {
    const name = context.buffer.extractAny(identifier);
    context.buffer.skipAny(separator);
    if (!name)
      context.syntaxError(
        `Enum value expected, but "${context.buffer.extractToAny(
          whitespace,
        )}" found`,
      );
    return { text: name, tokenType: 'Identifier' };
  }
}
