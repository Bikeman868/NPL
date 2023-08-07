import { IParsable, Position } from '#interfaces/IParsable.js';

const whitespace = [' ', '\t', '\n', '\r'];
const separator = [' ', '\t'];
const eol = '\n';
const openScope = '{';
const closeScope = '}';

export class ParsableString implements IParsable {
  private _buffer: string;
  private _position: Position;

  constructor(buffer: string) {
    this._buffer = buffer;
    this._position = { offset: 0, line: 1, column: 1 };
  }

  // Returns the next character
  private next(): string | null {
    if (this._position.offset === this._buffer.length) return null;

    const ch = this._buffer.charAt(this._position.offset);
    this._position.offset++;

    if (ch == eol) {
      this._position.column = 1;
      this._position.line++;
    } else {
      this._position.column++;
    }

    return ch;
  }

  // Returns the character underthe cursor
  private current(): string | null {
    if (this._position.offset === this._buffer.length) return null;
    return this._buffer.charAt(this._position.offset);
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

  skipAny(chars: string[]) {
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

      if (!matching) return;
      this.next();
    }
  }

  skipUntil(chars: string[]) {
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
    this.skipAny(whitespace);
  }

  skipSepararator() {
    this.skipAny(separator);
  }

  skipToEol() {
    this.skipUntil([eol]);
  }

  skipCount(count: number) {
    for (var i = 0; i < count; i++) this.next();
  }

  private extract(start: number): string {
    return start === this._position.offset
      ? ''
      : this._buffer.slice(start, this._position.offset);
  }

  extractToAny(chars: string[]): string {
    const startOffset = this._position.offset;
    this.skipUntil(chars);
    return this.extract(startOffset);
  }

  extractToEol(): string {
    return this.extractToAny([eol]);
  }

  extractCount(count: number): string {
    const startOffset = this._position.offset;
    for (var i = 0; i < count; i++) this.next();
    return this.extract(startOffset);
  }

  extractToWhitespace(): string {
    return this.extractToAny(whitespace);
  }

  extractToSeparator(): string {
    return this.extractToAny(separator);
  }

  hasScope(): boolean {
    this.skipUntil([eol, openScope]);
    return this.current() == openScope;
  }
}
