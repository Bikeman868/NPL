import { IToken } from '#interfaces/IToken.js';

export class TokenPrinter {
  private _output: (line: string) => void;
  private _indent: number;
  private _line: string;

  includeConsoleColors: boolean = false;

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

  private blankLine() {
    this._output('');
  }

  private red() {
    if (this.includeConsoleColors) this.write('\u001b[31m');
  }

  private green() {
    if (this.includeConsoleColors) this.write('\u001b[32m');
  }

  private yellow() {
    if (this.includeConsoleColors) this.write('\u001b[33m');
  }

  private blue() {
    if (this.includeConsoleColors) this.write('\u001b[34m');
  }

  private magenta() {
    if (this.includeConsoleColors) this.write('\u001b[35m');
  }

  private cyan() {
    if (this.includeConsoleColors) this.write('\u001b[36m');
  }

  private defaultColor() {
    if (this.includeConsoleColors) this.write('\u001b[0m');
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
          if (token.text == 'namespace' || token.text == 'network' || token.text == 'message' || token.text == 'application' || token.text == 'connection' || token.text == 'process') this.blankLine()
          this.cyan();
          this.write(token.text);
          this.defaultColor();
          this.write(' ');
          break;
        case 'ParamStart':
          this.red();
          this.write('(');
          this.defaultColor();
          break;
        case 'ParamEnd':
          this.red();
          this.write('(');
          this.defaultColor();
          break;
        case 'ScopeStart':
          this.yellow();
          this.write('{');
          this.defaultColor();
          this.eol();
          this._indent++;
          break;
        case 'ScopeEnd':
          this.eol();
          this._indent--;
          this.yellow();
          this.write('}');
          this.defaultColor();
          this.eol();
          break;
        case `Identifier`:
          this.red();
          this.write(token.text);
          this.defaultColor();
          this.write(' ');
          break;
        case `Expression`:
          this.yellow();
          this.write(token.text);
          this.defaultColor();
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
