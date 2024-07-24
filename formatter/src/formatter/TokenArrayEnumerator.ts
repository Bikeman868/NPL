import { ITokenEnumerator } from "../../../semantics/src/interfaces/ITokenStream.js";
import { IToken } from "npl-syntax";

export class TokenArrayEnumerator implements ITokenEnumerator {
    private tokens: IToken[];
    private index: number = 0;

    constructor (tokens: IToken[]) {
        this.tokens = tokens;
    }

    getNextToken(): IToken | undefined {
        if (this.index == this.tokens.length)
            return undefined;
        
        const result = this.tokens[this.index]
        this.index = this.index + 1;
        return result;
    }
}