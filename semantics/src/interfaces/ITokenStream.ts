import { IToken } from 'npl-syntax';

export interface ITokenStream {
    preserveComments: boolean;
    next(): IToken;
    peek(): IToken | undefined;
    moveCommentsTo(comments?: string[]): void;
}