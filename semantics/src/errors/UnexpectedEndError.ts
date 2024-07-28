import { ITokenStream } from '#interfaces/ITokenStream.js';

export class UnexpectedEndError extends Error {
    constructor(message: string, tokens: ITokenStream) {
        super(`${message} but there was no more input in "${tokens.name}"`);
    }
}
