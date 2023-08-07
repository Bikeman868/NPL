export type Position = { line: number; column: number; offset: number };

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

  extractToWhitespace(): string;
  extractToSeparator(): string;
  extractToEol(): string;
  extractCount(count: number): string;
  extractToAny(chars: string[]): string;

  hasScope(): boolean;
}
