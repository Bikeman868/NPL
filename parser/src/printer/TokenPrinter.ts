import { IToken } from '#interfaces/IToken.js';

export class TokenPrinter {
  private _output: (line: string) => void;
  private _indent: number;
  private _line: string;

  constructor(output?: (line: string) => void) {
    this._indent = 0;
    this._line = '';
    this._output =
      output ||
      ((line) => {
        console.log(line);
      });
  }

  private write(text: string) {
    this._line += text;
  }

  private eol() {
    if (this._line) {
      let indent = '';
      for (let i = 0; i < this._indent; i++) indent += '  ';
      this._output(indent + this._line);
      this._line = '';
    }
  }

  print(tokens: IToken[]) {
    for (var index = 0; index < tokens.length; index++) {
      const token = tokens[index];
      const nextToken =
        index < tokens.length - 1 ? tokens[index + 1] : undefined;
      const prevToken = index > 0 ? tokens[index - 1] : undefined;
      switch (token.tokenType) {
        case 'Keyword':
          if (!prevToken || prevToken.tokenType != 'Keyword') this.eol();
          this.write(token.text);
          this.write(' ');
          break;
        case 'ParamStart':
          this.write('(');
          break;
        case 'ParamEnd':
          this.write('(');
          break;
        case 'ScopeStart':
          this.write('{');
          this.eol();
          this._indent++;
          break;
        case 'ScopeEnd':
          this.eol();
          this._indent--;
          this.write('}');
          this.eol();
          break;
        case `Expression`:
          this.write(token.text);
          this.eol();
          break;
        default:
          this.write(token.text);
          this.write(' ');
          break;
      }
    }
  }
}
