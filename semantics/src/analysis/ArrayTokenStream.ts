import { UnexpectedEndError } from "#exceptions/UnexpectedEndError.js";
import { ITokenStream } from "#interfaces/ITokenStream.js";
import { IToken } from "npl-syntax";

export class ArrayTokenStream implements ITokenStream {
    private tokens: IToken[];
    private index: number = 0;
    private comments: string[] = [];

    preserveComments: boolean;

    constructor (tokens: IToken[], preserveComments: boolean) {
        this.tokens = tokens;
        this.preserveComments = preserveComments;
    }

    next(): IToken {
        for(;;) {
            if (this.index == this.tokens.length)
                throw new UnexpectedEndError('More tokens were expected at the end of the token stream');
            
            const token = this.tokens[this.index]
            this.index = this.index + 1;

            if (token.tokenType == 'Comment') {
                this.comments.push(token.text);
            } else {
                return token;
            }
        }
    }

    peek(): IToken | undefined {
        for (let i = this.index; ; i++) {
            if (this.index == this.tokens.length)
                return undefined;

            const token = this.tokens[i];

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
}