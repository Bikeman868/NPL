import { ITokenStream } from '#interfaces/ITokenStream.js';
import { IToken } from 'npl-syntax';

export class SemanticError extends Error {
    constructor(message: string, tokens: ITokenStream, token: IToken) {
        super(
            `${message} but found ${token.tokenType} "${token.text}" at L${token.position.line}:C${token.position.column} in "${tokens.name}"`,
        );
    }
}
