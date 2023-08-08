import { IContext } from '#interfaces/IContext.js';
import { IToken } from '#interfaces/IToken.js';
import { Token } from '../Token.js';
import { ParseResult } from './ParseResult.js'
import { parseSourceFile } from './parseSourceFile.js'
import { parseUsing } from './parseUsing.js'
import { parseNamespace } from './parseNamespace.js'
import { parseApplication } from './parseApplication.js'
import { parseNetwork } from './parseNetwork.js'
import { parseMessage } from './parseMessage.js'
import { parseConnection } from './parseConnection.js'
import { parseProcess } from './parseProcess.js'
import { parseObject } from './parseObject.js'
import { parseExpression } from './parseExpression.js'

export function parseToken(context: IContext, updateContext: boolean): IToken {
    context.capturePosition();
    let result: ParseResult | undefined;

    switch (context.currentState.state) {
      case 'sourcefile':
        result = parseSourceFile(context, updateContext);
        break;
      case 'using':
        result = parseUsing(context, updateContext);
        break;
        case 'namespace':
        result = parseNamespace(context, updateContext);
        break;
        case 'application':
        result = parseApplication(context, updateContext);
        break;
        case 'network':
        result = parseNetwork(context, updateContext);
        break;

        case 'message':
        result = parseMessage(context, updateContext);
        break;
      case 'connection':
        result = parseConnection(context, updateContext);
        break;
      case 'process':
        result = parseProcess(context, updateContext)
        break;
        case 'object':
        result = parseObject(context, updateContext);
        break;
      case 'expression':
        result = parseExpression(context, updateContext);
        break;
    }

    if (!result) throw new Error('Unknown state ' + context.currentState.state);

    const position = context.buffer.getPosition();
    const length = position.offset - context.position.offset;

    context.debug(() => {
      const state = context.currentState.getDescription();
      return `Parsed ${result?.tokenType} token "${result?.text}" as offset ${position.offset} (L${position.line}:C${position.column}). Next state is ${state}`;
    });

    if (!updateContext) context.restorePosition();
    return new Token(result.text, result.tokenType, length);
  }
