import { UnexpectedEndError } from "#exceptions/UnexpectedEndError.js";
import { ITokenStream } from "#interfaces/ITokenStream.js";
import { IContext, IParser, IToken } from "npl-syntax";

// Creates an ITokenStreamn from an IParser
export class ParserTokenStream implements ITokenStream {
    private context: IContext;
    private parser: IParser;
    private tokenQueue: IToken[];
    private comments: string[] = [];

    preserveComments: boolean = false;

    constructor (parser: IParser, context: IContext, preserveComments: boolean) {
        this.parser = parser;
        this.context = context;
        this.preserveComments = preserveComments;
        this.tokenQueue = [];
    }

    next(): IToken {
        for(;;) {
            const token = this.dequeueNextToken();
            if (!token)
                throw new UnexpectedEndError('More tokens were expected at the end of the token stream');

            if (token.tokenType == 'Comment')
                this.comments.push(token.text);
            else
                return token;
        }
    }

    peek(): IToken | undefined {
        for(let i = 0; ; i++) {
            if (this.tokenQueue.length == i) this.queueNextToken();

            const token = this.tokenQueue[i];
            if (!token)
                return undefined;

            if (token.tokenType != 'Comment')
                return token;
        }
    }

    moveCommentsTo(comments: string[]): void {
        if (this.preserveComments && this.comments.length) {
            if (comments) {
                for (const comment of this.comments)
                    comments.push(comment);
            }
        }
        this.comments = [];
    }

    private queueNextToken() {
        const token = this.parser.extractNextToken(this.context);
        if (token) this.tokenQueue.push(token);
    }

    private dequeueNextToken(): IToken | undefined {
        if (!this.tokenQueue.length)
            this.queueNextToken();
        return this.tokenQueue.shift();
    }
}