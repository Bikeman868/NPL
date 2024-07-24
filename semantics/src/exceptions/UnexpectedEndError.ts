export class UnexpectedEndError extends Error {
    constructor(message: string) {
        super(message + ' but there was no more input');
    }
}
