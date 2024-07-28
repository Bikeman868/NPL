import { UnexpectedEndError } from '#errors/UnexpectedEndError.js';
import { ITokenStream } from '#interfaces/ITokenStream.js';
import { IContext, IParser, IToken } from 'npl-syntax';

// Creates an ITokenStreamn from an IParser
export class ParserTokenStream implements ITokenStream {
    private _name: string;
    private _context: IContext;
    private _parser: IParser;
    private _tokenQueue: IToken[];
    private _comments: string[] = [];
    private _preserveComments: boolean;

    constructor(name: string, parser: IParser, context: IContext, preserveComments: boolean) {
        this._name = name;
        this._parser = parser;
        this._context = context;
        this._preserveComments = preserveComments;
        this._tokenQueue = [];
    }

    get name(): string {
        return this._name;
    }

    get preserveComments(): boolean {
        return this._preserveComments;
    }

    next(): IToken {
        for (;;) {
            const token = this.dequeueNextToken();
            if (!token) throw new UnexpectedEndError('More tokens were expected at the end of the token stream', this);

            if (token.tokenType == 'Comment') this._comments.push(token.text);
            else return token;
        }
    }

    peek(): IToken | undefined {
        for (let i = 0; ; i++) {
            if (this._tokenQueue.length == i) this.queueNextToken();

            const token = this._tokenQueue[i];
            if (!token) return undefined;

            if (token.tokenType != 'Comment') return token;
        }
    }

    attachCommentsTo(model?: { comments: string[] }): void {
        if (this.preserveComments && this._comments.length) {
            if (model) {
                for (const comment of this._comments) model.comments.push(comment);
            }
        }
        this._comments = [];
    }

    private queueNextToken() {
        const token = this._parser.extractNextToken(this._context);
        if (token) this._tokenQueue.push(token);
    }

    private dequeueNextToken(): IToken | undefined {
        if (!this._tokenQueue.length) this.queueNextToken();
        return this._tokenQueue.shift();
    }
}
