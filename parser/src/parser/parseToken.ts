import { IContext } from '#interfaces/IContext.js';
import { IToken } from '#interfaces/IToken.js';
import { Token } from './Token.js';
import { ParseResult } from '../interfaces/ParseResult.js';
import { whitespace, blockCommentStart, blockCommentEnd, separator } from '#parser/charsets.js';
import { parseNextToken } from './stateMachine/graphFunctions.js';

export function parseToken(context: IContext): IToken | undefined {
    const indent = context.getDebugIndent();
    context.capturePosition();
    let result: ParseResult | undefined;

    if (context.buffer.peek(blockCommentStart.length) == blockCommentStart) {
        context.debug(() => 'Found a block comment', indent);
        context.buffer.skipCount(blockCommentStart.length);
        context.buffer.skipAny(whitespace);
        const text = context.buffer.extractUntil(blockCommentEnd).trim();
        context.buffer.skipCount(blockCommentEnd.length);
        context.buffer.skipAny(separator);
        result = { tokenType: 'Comment', text };
    } else {
        result = parseNextToken(context);
    }

    const endPosition = context.buffer.getPosition();
    const length = endPosition.offset - context.position.offset;

    context.debug(() => {
        const startPos = context.position;
        const text = result ? result.text.replace(/(?:\r\n|\r|\n)/g, '\\n') : '';
        return `Parsed ${result?.tokenType} token "${text}" at (L${startPos.line}:C${startPos.column}). Next token should be ${context.pathDescription}`;
    }, indent);

    if (context.isDryRun) context.restorePosition();
    return result ? new Token(result.text, result.tokenType, length) : undefined;
}
