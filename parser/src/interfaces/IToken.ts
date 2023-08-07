import { TokenType } from '#interfaces/TokenType.js';

export interface IToken {
  length: number;
  tokenType: TokenType;
  text: string;
}
