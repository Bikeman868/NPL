import { IParsable, Position } from '#interfaces/IParsable.js';

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

    if (ch == '\n') {
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

  skipAny(...chars: string[]) {
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

  skipUntil(...chars: string[]) {
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
      this.next()
    }
  }

  skipWhitespace() {
    this.skipAny(' ', '\t', '\r', '\n');
  }

  skipSepararator() {
    this.skipAny(' ', '\t');
  }

  skipToEol() {
    this.skipAny('\n');
  }

  skipCount(count: number) {
    for (var i = 0; i < count; i++) this.next();
  }

  extractToAny(...chars: string[]): string {
    const startOffset = this._position.offset;
    this.skipUntil(...chars);
    return startOffset === this._position.offset
      ? ''
      : this._buffer.slice(startOffset, this._position.offset);
  }

  extractToEol(): string {
    return this.extractToAny('\n');
  }

  extractToWhitespace(): string {
    return this.extractToAny(' ', '\t', '\r', '\n');
  }
}
