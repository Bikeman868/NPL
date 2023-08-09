import { IContext } from '#interfaces/IContext.js';
import { ParseResult } from '../functions/ParseResult.js';
import { parseScopeDefinition } from '../functions/parseScopeDefinition.js';

export function parseSourceFile(
  context: IContext,
  updateContext: boolean,
): ParseResult {
  context.buffer.skipWhitespace();
  return parseScopeDefinition(context, updateContext, [
    { keyword: 'using', state: 'using', subState: 'identifier' },
    { keyword: 'namespace', state: 'namespace', subState: 'identifier' },
  ]);
}
