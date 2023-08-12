import { IContext } from '#interfaces/IContext.js';
import { IToken } from '#interfaces/IToken.js';
import { StateName } from '#interfaces/IParserState.js';
import { Token } from '../Token.js';
import { ParseResult } from './ParseResult.js';
import { parseSourceFile } from '../states/parseSourceFile.js';
import { parseUsing } from '../states/parseUsing.js';
import { parseNamespace } from '../states/parseNamespace.js';
import { parseApplication } from '../states/parseApplication.js';
import { parseNetwork } from '../states/parseNetwork.js';
import { parseMessage } from '../states/parseMessage.js';
import { parseConnection } from '../states/parseConnection.js';
import { parseProcess } from '../states/parseProcess.js';
import { parseObject } from '../states/parseObject.js';
import { parseExpression } from '../states/parseExpression.js';
import { parseAccept } from '../states/parseAccept.js';
import { parseRoute } from '../states/parseRoute.js';
import { parseEmit } from '../states/parseEmit.js';
import { parseEntrypoint } from '../states/parseEntrypoint.js';
import { 
  newline,
  whitespace,
  lineCommentDelimiter,
  blockCommentStart,
  blockCommentEnd,
} from '#interfaces/charsets.js'

// Performs one iteration of the token parsing state machine. Delagates to
// a function that is specific to the current state

const stateMachines: Map<StateName, (context: IContext) => ParseResult> =
  new Map([
    ['sourcefile', parseSourceFile],
    ['using', parseUsing],
    ['namespace', parseNamespace],
    ['application', parseApplication],
    ['network', parseNetwork],
    ['message', parseMessage],
    ['connection', parseConnection],
    ['process', parseProcess],
    ['accept', parseAccept],
    ['object', parseObject],
    ['expression', parseExpression],
    ['route', parseRoute],
    ['emit', parseEmit],
    ['entrypoint', parseEntrypoint],
  ]);

export function parseToken(context: IContext): IToken {
  const stateMachine = stateMachines.get(context.currentState.state);
  if (!stateMachine)
    throw new Error(
      'No state machine configured for ' +
        context.currentState.state +
        ' state',
    );

  const indent = context.getDebugIndent();
  context.capturePosition();
  let result: ParseResult;

  const peek = context.buffer.peek(2);

  if (peek == lineCommentDelimiter) {
    context.buffer.skipCount(lineCommentDelimiter.length);
    context.buffer.skipAny(whitespace);
    const text = context.buffer.extractToAny([newline]);
    context.buffer.skipAny(whitespace);
    result = { tokenType: 'Comment', text }
  } else if (peek == blockCommentStart) {
    context.buffer.skipCount(blockCommentStart.length);
    context.buffer.skipAny(whitespace);
    const text = context.buffer.extractUntil(blockCommentEnd).trim();
    context.buffer.skipCount(blockCommentEnd.length);
    context.buffer.skipAny(whitespace);
    result = { tokenType: 'Comment', text }
  } else {
    result = stateMachine(context);
  }
  
  const endPosition = context.buffer.getPosition();
  const length = endPosition.offset - context.position.offset;

  context.debug(() => {
    const state = context.currentState.getDescription();
    const startPos = context.position;
    return `${indent}Parsed ${result?.tokenType} token "${result?.text}" at offset ${startPos.offset} (L${startPos.line}:C${startPos.column}). Expecting ${state} next`;
  });

  if (context.isDryRun) context.restorePosition();
  return new Token(result.text, result.tokenType, length);
}
