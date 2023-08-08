export type Position = { line: number; column: number; offset: number };

export const whitespace = [' ', '\t', '\n', '\r'];
export const separator = [' ', '\t'];
export const eol = '\n';
export const openScope = '{';
export const closeScope = '}';
export const lineCommentDelimiter = '/';
export const blockCommentDelimiter = '*';

export interface IParsable {
  getPosition(): Position;
  setPosition(position: Position): void;

  isEof(): boolean;

  skipAny(chars: string[]): void;
  skipUntil(chars: string[]): void;

  skipWhitespace(): void;
  skipSepararator(): void;
  skipToEol(): void;
  skipCount(count: number): void;

  extractToEnd(...endChars: string[]): string;
  extractToSeparator(): string;
  extractCount(count: number): string;
  extractToAny(chars: string[]): string;

  hasScope(): boolean;
  isEndScope(): boolean;
}
