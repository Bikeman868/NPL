import { Position } from './Position.js';
import { Charset } from './charsets.js';

/**
 * Defines a stream of input text that can be parsed
 */
export interface IParsable {
    getPosition(): Position;
    setPosition(position: Position): void;
    getRaw(position: Position, lenght: number): string;

    isEof(): boolean;
    isEol(): boolean;

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
    extractString(delimiter: string): string;

    hasScope(): boolean;
    isEndScope(): boolean;
    isBeginScope(): boolean;
}
