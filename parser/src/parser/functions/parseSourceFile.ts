import { IContext } from '#interfaces/IContext.js';
import { ParseResult } from './ParseResult.js'
import { parseScopeDefinition } from './parseScopeDefinition';

  export function parseSourceFile(
    context: IContext,
    updateContext: boolean,
  ): ParseResult {
    return parseScopeDefinition(context, updateContext, [
      { keyword: 'using', state: 'using', subState: 'identifier' },
      { keyword: 'namespace', state: 'namespace', subState: 'identifier' },
    ]);
  }

