import { UnexpectedEndError } from '#errors/UnexpectedEndError.js';
import { ITokenStream } from '#interfaces/ITokenStream.js';
import { IToken } from 'npl-syntax';

export class ArrayTokenStream implements ITokenStream {
    private _name: string;
    private _tokens: IToken[];
    private _index: number = 0;
    private _comments: string[] = [];
    private _preserveComments: boolean;

    constructor(name: string, tokens: IToken[], preserveComments: boolean) {
        this._name = name;
        this._tokens = tokens;
        this._preserveComments = preserveComments;
    }

    get name(): string {
        return this._name;
    }

    get preserveComments(): boolean {
        return this._preserveComments;
    }

    next(): IToken {
        while (true) {
            if (this._index == this._tokens.length)
                throw new UnexpectedEndError('More tokens were expected at the end of the token stream', this);

            const token = this._tokens[this._index];
            this._index = this._index + 1;

            if (token.tokenType == 'Comment') {
                this._comments.push(token.text);
            } else {
                return token;
            }
        }
    }

    peek(): IToken | undefined {
        for (let i = this._index; ; i++) {
            if (this._index == this._tokens.length) return undefined;

            const token = this._tokens[i];

            if (token.tokenType != 'Comment') return token;
        }
    }

    attachCommentsTo(model?: { comments: string[] }): void {
        if (this._preserveComments && this._comments.length) {
            if (model) {
                for (const comment of this._comments) model.comments.push(comment);
            }
        }
        this._comments = [];
    }
}
