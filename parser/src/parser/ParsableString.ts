import { IParsable } from '#interfaces/IParsable.js';
import { Position } from '#interfaces/Position.js';
import {
  Charset,
  whitespace,
  newline,
  cr,
  openScope,
  closeScope,
  lineCommentDelimiter,
} from '#interfaces/charsets.js';

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

  isEof(): boolean {
    return this._position.offset == this._buffer.length;
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
    while (this._position.offset < this._buffer.length) {
      if (this.peek(2) == lineCommentDelimiter) return;

      let ch = this.current();
      if (!ch) return;
      if (ch == newline || ch == closeScope) return;
      this.next();
    }
  }

  skipCount(count: number) {
    for (var i = 0; i < count; i++) this.next();
  }

  private extract(start: number): string {
    return start === this._position.offset
      ? ''
      : this._buffer.slice(start, this._position.offset).replace(cr, '');
  }

  extractToAny(chars: Charset): string {
    const startOffset = this._position.offset;
    this.skipUntil(chars);
    return this.extract(startOffset);
  }

  extractCount(count: number): string {
    const startOffset = this._position.offset;
    for (var i = 0; i < count; i++) this.next();
    return this.extract(startOffset);
  }

  extractAny(chars: Charset): string {
    const startOffset = this._position.offset;
    this.skipAny(chars);
    return this.extract(startOffset);
  }

  extractToEol(): string {
    const startOffset = this._position.offset;
    this.skipToEol();
    return this.extract(startOffset);
  }

  extractUntil(matchingText: string): string {
    const start = this._position.offset;
    const end = this._buffer.indexOf(matchingText, this._position.offset);
    this.skipCount(end - start);
    return this._buffer.slice(start, end).replace(cr, '');
  }

  /**
   * For optional scope blocks, the opening { must be on the same line
   * Moves the cursor to the opening { or eol. Retuns true if it is {
   */
  hasScope(): boolean {
    this.skipUntil([newline, openScope]);
    return this.current() == openScope;
  }

  /**
   * @returns true if there is no more definitions in this scope blosk
   */
  isEndScope(): boolean {
    return this.current() == closeScope;
  }
}
