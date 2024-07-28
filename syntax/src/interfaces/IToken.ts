import { TokenType } from '#interfaces/TokenType.js';
import { Position } from './Position.js';

/**
 * Represents a token from the input stream. Can be a symbol, string,
 * comment, reserved word etc
 */
export interface IToken {
    position: Position,
    length: number,
    tokenType: TokenType;
    text: string;
}
