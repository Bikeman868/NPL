import { TokenType } from '#interfaces/TokenType.js';

/**
 * Represents a token from the input stream. Can be a symbol, string,
 * comment, reserved word etc
 */
export interface IToken {
    length: number;
    tokenType: TokenType;
    text: string;
}
