import { Position } from './Position.js';
import { Charset } from './charsets.js';

export interface IParsable {
  getPosition(): Position;
  setPosition(position: Position): void;

  isEof(): boolean;

  skipAny(chars: Charset): void;
  skipUntil(chars: Charset): void;

  skipWhitespace(): void;
  skipSepararator(): void;
  skipToEol(): void;
  skipCount(count: number): void;

  extractAny(chars: Charset): string;
  extractToSeparator(): string;
  extractCount(count: number): string;
  extractToAny(chars: Charset): string;

  hasScope(): boolean;
  isEndScope(): boolean;
}
