export type Position = { line: number; column: number; offset: number };

export interface IParsable {
  getPosition(): Position;
  setPosition(position: Position): void;

  isEof(): boolean;

  skipWhitespace(): void;
  skipSepararator(): void;
  skipCount(count: number): void;
  skipAny(...chars: string[]): void;

  extractToEol(): string;
  extractToWhitespace(): string;
  extractToAny(...chars: string[]): string;
}
