import { IParsable } from '#interfaces/IParsable.js';
import { Position } from '#interfaces/Position.js';
import {
  Charset,
  whitespace,
  separator,
  identifier,
  cr,
  openScope,
  closeScope,
  lineCommentDelimiter,
  blockCommentDelimiter,
} from '#interfaces/charsets.js';

export class ParsableString implements IParsable {
  private _buffer: string;
  private _position: Position;

  constructor(buffer: string) {
    this._buffer = buffer;
    this._position = { offset: 0, line: 1, column: 1 };
  }
  // Advances the cursor to the next character
  private next(): string | null {
    if (this._position.offset === this._buffer.length) return null;

    const ch = this._buffer.charAt(this._position.offset);
    this._position.offset++;

    if (ch == cr) {
      this._position.column = 1;
      this._position.line++;
    } else {
      this._position.column++;
    }

    return ch;
  }

  // Returns the character under the cursor
  private current(): string | null {
    if (this._position.offset === this._buffer.length) return null;
    return this._buffer.charAt(this._position.offset);
  }

  // Peeks at the next character without advancing the cursor
  private lookAhead(): string | null {
    if (this._position.offset + 1 >= this._buffer.length) return null;
    return this._buffer.charAt(this._position.offset + 1);
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

  skipWhitespace() {
    while (this._position.offset < this._buffer.length) {
      const current = this.current();
      if (!current) return;

      let matching = false;

      for (let char of whitespace) {
        if (current == char) {
          matching = true;
          break;
        }
      }

      if (!matching) return;
      this.next();
    }
  }

  skipSepararator() {
    this.skipAny(separator);
  }

  skipToEol() {
    while (this._position.offset < this._buffer.length) {
      let ch = this.current();
      if (!ch) return;
      if (ch == cr || ch == closeScope) return;
      if (ch == lineCommentDelimiter) {
        if (this.lookAhead() == lineCommentDelimiter) {
          while (true) {
            const next = this.next();
            if (!next || next == cr) break;
          }
          continue;
        }
      }
      this.next();
    }
  }

  skipCount(count: number) {
    for (var i = 0; i < count; i++) this.next();
  }

  private extract(start: number): string {
    return start === this._position.offset
      ? ''
      : this._buffer.slice(start, this._position.offset);
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

  /**
   * For optional scope blocks, the opening { must be on the same line
   * Moves the cursor to the opening { or eol. Retuns true if it is {
   */
  hasScope(): boolean {
    this.skipUntil([cr, openScope]);
    return this.current() == openScope;
  }

  /**
   * @returns true if there is no more definitions in this scope blosk
   */
  isEndScope(): boolean {
    return this.current() == closeScope;
  }
}
