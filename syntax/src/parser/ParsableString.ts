import { IParsable } from '#interfaces/IParsable.js';
import { Position } from '#interfaces/Position.js';
import {
    Charset,
    whitespace,
    newline,
    cr,
    openCurlyBracket,
    closeCurlyBracket,
    lineCommentDelimiter,
    separator,
} from '#parser/charsets.js';

export class ParsableString implements IParsable {
    private _buffer: string;
    private _position: Position;

    constructor(buffer: string) {
        this._buffer = buffer;
        this._position = { offset: 0, line: 1, column: 1 };
        this.skipAny(whitespace);
    }

    // Advances the cursor to the next character skipping carriage returns
    private next(): string | null {
        while (true) {
            if (this._position.offset === this._buffer.length) return null;

            const ch = this._buffer.charAt(this._position.offset++);

            if (ch == newline) {
                this._position.column = 1;
                this._position.line++;
            } else {
                this._position.column++;
            }

            if (ch != cr) return ch;
        }
    }

    // Returns the character under the cursor
    private current(): string | null {
        let i = this._position.offset;
        while (true) {
            if (i === this._buffer.length) return null;
            const ch = this._buffer.charAt(i++);
            if (ch != cr) return ch;
        }
    }

    // Returns `count` characters starting with the character under the cursor but does
    // not move the cursor. Ignores linefeeds
    peek(count: number): string {
        let result: string = '';
        let i = this._position.offset;
        while (result.length < count && i < this._buffer.length) {
            const ch = this._buffer.charAt(i++);
            if (ch != cr) result += ch;
        }
        return result;
    }

    getPosition(): Position {
        return { ...this._position };
    }

    setPosition(position: Position) {
        this._position = position;
    }

    getRaw(position: Position, length: number): string {
        return this._buffer.substring(position.offset, position.offset + length);
    }

    isEof(): boolean {
        return this._position.offset == this._buffer.length;
    }

    isEol(): boolean {
        return this.peek(1) == newline;
    }

    skipAny(chars: Charset) {
        while (this._position.offset < this._buffer.length) {
            const current = this.current();
            if (!current) return;

            let matching = false;

            for (let char of chars) {
                if (current == char) {
                    matching = true;
                    break;
                }
            }

            if (!matching) return;
            this.next();
        }
    }

    skipUntil(chars: Charset) {
        while (this._position.offset < this._buffer.length) {
            let ch = this.current();
            if (!ch) return;

            let matching = false;

            for (let char of chars) {
                if (ch == char) {
                    matching = true;
                    break;
                }
            }

            if (matching) return;
            this.next();
        }
    }

    skipToEol() {
        let scopeDepth = 0;
        while (this._position.offset < this._buffer.length) {
            if (this.peek(2) == lineCommentDelimiter) return;

            let ch = this.current();
            if (!ch) return;
            if (ch == newline) return;
            if (ch == closeCurlyBracket) {
                if (scopeDepth == 0) return;
                scopeDepth--;
            }
            if (ch == openCurlyBracket) scopeDepth++;
            this.next();
        }
    }

    skipCount(count: number) {
        for (let i = 0; i < count; i++) this.next();
    }

    private extract(predicate: (ch: string) => boolean) {
        let result = '';
        while (this._position.offset < this._buffer.length) {
            let ch = this.current();
            if (!ch || !predicate(ch)) break;
            result += ch;
            this.next();
        }
        return result;
    }

    extractToAny(chars: Charset): string {
        return this.extract((ch) => {
            for (let char of chars) {
                if (ch == char) return false;
            }
            return true;
        });
    }

    extractCount(count: number): string {
        let result = '';
        for (let i = 0; i < count; i++) {
            result += this.current();
            this.next();
        }
        return result;
    }

    extractAny(chars: Charset): string {
        return this.extract((ch) => {
            for (let char of chars) {
                if (ch == char) return true;
            }
            return false;
        });
    }

    extractToEol(): string {
        let result = '';
        let scopeDepth = 0;
        while (this._position.offset < this._buffer.length) {
            if (this.peek(2) == lineCommentDelimiter) return result;

            let ch = this.current();
            if (!ch) return result;
            if (ch == newline) return result;
            if (ch == closeCurlyBracket) {
                if (scopeDepth == 0) return result;
                scopeDepth--;
            }
            if (ch == openCurlyBracket) scopeDepth++;

            result += ch;
            this.next();
        }
        return result;
    }

    extractUntil(matchingText: string): string {
        let result = '';
        while (this.peek(matchingText.length) != matchingText) {
            result += this.current();
            this.next();
        }
        return result;
    }

    /** Exctracts a delimited string. Assumes that the opening delimiter was already
     * consumed. Consumes up to an including the closing delimiter and returns the
     * string within the delimiters.
     * Supports \ as an escape to allow embedded delimiters. \\ inserts just one \
     * Supports \n \r \f \t for standard control characters. Does not support \uxxxx
     */
    extractString(delimiter: string): string {
        let result = '';
        let escape = false;
        while (this._position.offset < this._buffer.length) {
            let ch = this.current();
            if (ch == '\\') {
                escape = true;
            } else {
                if (escape) {
                    switch (ch) {
                        case 'n':
                            result += '\n';
                            break;
                        case 'r':
                            result += '\r';
                            break;
                        case 'f':
                            result += '\f';
                            break;
                        case 't':
                            result += '\t';
                            break;
                        default:
                            result += ch;
                            break;
                    }
                    escape = false;
                } else {
                    if (ch == delimiter) {
                        this.next(); // Skip the closing delimiter
                        break;
                    }
                    result += ch;
                }
            }
            this.next();
        }
        return result;
    }

    /**
     * For optional scope blocks, the opening { must be on the same line
     * Moves the cursor to the opening { or eol. Retuns true if it is {
     */
    hasScope(): boolean {
        this.skipAny(separator);
        return this.current() == openCurlyBracket;
    }

    /**
     * @returns true if there is no more definitions in this scope block
     */
    isEndScope(): boolean {
        return this.current() == closeCurlyBracket;
    }

    /**
     * @returns true if this is the start of a scope block
     */
    isBeginScope(): boolean {
        return this.current() == openCurlyBracket;
    }
}
