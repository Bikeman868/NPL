import { Position } from './Position.js';
import { Charset } from './charsets.js';

export interface IParsable {
  getPosition(): Position;
  setPosition(position: Position): void;

  isEof(): boolean;

  peek(count: number): string;

  skipAny(chars: Charset): void;
  skipUntil(chars: Charset): void;

  skipToEol(): void;
  skipCount(count: number): void;

  extractAny(chars: Charset): string;
  extractCount(count: number): string;
  extractToAny(chars: Charset): string;
  extractUntil(matchingText: string): string;
  extractToEol(): string;

  hasScope(): boolean;
  isEndScope(): boolean;
}
