import { IToken } from 'npl-syntax';

export interface ITokenStream {
    // Usually the file name if the source code came froma  file
    get name(): string;

    // When true the token stream will set comments aside, and allow you to attach them to a model
    get preserveComments(): boolean;

    // Extracts the next token from the stream
    next(): IToken;

    // Peeks the next token in the stream withou advancing thr stream pointer
    peek(): IToken | undefined;

    // Takes comments accumulated whilst processing the stream and attaches them to
    // model. Also clears the list of comments so that each comment is only attached once
    attachCommentsTo(model?: { comments: string[] }): void;
}
