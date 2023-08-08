import { IContext } from '#interfaces/IContext.js';
import { ParseResult } from './ParseResult.js'
import { parseNamedScope } from './parseNamedScope.js'
import { parseScope } from './parseScope.js'
import { parseScopeDefinition } from './parseScopeDefinition.js'

export function parseApplication(context: IContext, updateContext: boolean): ParseResult {
  switch (context.currentState.subState) {
    case 'identifier': return parseApplicationIdentifier(context, updateContext)
    case 'scope': return parseApplicationScope(context, updateContext)
    case 'definition': return parseApplicationDefinition(context, updateContext)
  }
  throw new Error('Unknown application sub-state ' + context.currentState.subState);
}

  function parseApplicationIdentifier(
    context: IContext,
    updateContext: boolean,
  ): ParseResult {
    return parseNamedScope(
      context,
      updateContext,
      'application',
      'scope'
    );
  }

  function parseApplicationScope(
    context: IContext,
    updateContext: boolean,
  ): ParseResult {
    return parseScope(context, updateContext);
  }

  function parseApplicationDefinition(
    context: IContext,
    updateContext: boolean,
  ): ParseResult {
    return parseScopeDefinition(context, updateContext, [
      { keyword: 'connection', state: 'connection', subState: 'identifier' },
    ]);
  }
