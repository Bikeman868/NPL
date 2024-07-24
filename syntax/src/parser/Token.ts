import { IToken } from '#interfaces/IToken.js';
import { TokenType } from '#interfaces/TokenType.js';

export class Token implements IToken {
    private _text: string;
    private _tokenType: TokenType;
    private _length: number;

    constructor(text: string, tokenType: TokenType, length: number) {
        this._text = text;
        this._tokenType = tokenType;
        this._length = length;
    }

    get length() {
        return this._length;
    }

    get tokenType() {
        return this._tokenType;
    }

    get text() {
        return this._text;
    }
}
