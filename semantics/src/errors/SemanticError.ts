import { ITokenStream } from '#interfaces/ITokenStream.js';
import { IToken } from 'npl-syntax';

export class SemanticError extends Error {
    constructor(expecting: string, tokens: ITokenStream, token: IToken) {
        super(
            `Expecting ${expecting} but found ${token.tokenType} "${token.text}" at L${token.position.line}:C${token.position.column} in "${tokens.name}"`,
        );
    }
}
