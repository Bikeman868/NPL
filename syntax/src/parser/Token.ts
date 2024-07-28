import { IToken } from '#interfaces/IToken.js';
import { Position } from '#interfaces/Position.js';
import { TokenType } from '#interfaces/TokenType.js';

export class Token implements IToken {
    private _text: string;
    private _tokenType: TokenType;
    private _position: Position;
    private _length: number;

    constructor(text: string, tokenType: TokenType, position: Position, length: number) {
        this._text = text;
        this._tokenType = tokenType;
        this._position = position;
        this._length = length;
    }

    get position() {
        return this._position;
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
