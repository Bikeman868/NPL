import { SyntaxError } from '#interfaces/SyntaxError';
import textStyle from  './consoleEscape.js'

export class SyntaxErrorPrinter {
  private _output: (line: string) => void;
  private _indent: number;
  private _line: string;

  includeStateStack: boolean = false;
  includeMultipleErrorsOnSameLine: boolean = false;
  includeConsoleColors: boolean = false;

  constructor(output?: (line: string) => void) {
    this._indent = 0;
    this._line = '';
    this._output = output || (line => { console.log(line); });
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

  private errorColor() {
    if (this.includeConsoleColors) {
      this.write(textStyle.red);
      this.write(textStyle.bold);
    }
  }

  private lineNumberColor() {
    if (this.includeConsoleColors) {
      this.write(textStyle.cyan);
      this.write(textStyle.dim);
    }
  }

  private defaultColor() {
    if (this.includeConsoleColors) this.write(textStyle.reset);
  }

  print(sourceFileText: string, syntaxErrors: SyntaxError[]) {
    const sourceLines = sourceFileText.split('\n');

    let syntaxErrorIndex = 0;
    let error = syntaxErrors[syntaxErrorIndex];

    let lineNumber = 1;
    for (const sourceLine of sourceLines) {
      this.lineNumberColor();
      this.write(('000' + lineNumber).slice(-3));
      this.defaultColor();
      this.write(' ');
      this.write(sourceLine);
      this.eol();

      while (error?.line == lineNumber) {
        let indent = '';
        for (let i = 1; i < error.column; i++) indent += ' ';

        this.write(indent);
        this.errorColor();
        this.write('^ ');
        this.write(error.message);
        this.defaultColor();
        this.eol();

        if (this.includeStateStack) {
          for (const state of error.state.split('\n')) {
            this.write(indent);
            this.write('  ');
            this.write(state);
            this.eol();
          }
          this._output('');
        }

        if (this.includeMultipleErrorsOnSameLine)
          error = syntaxErrors[++syntaxErrorIndex];
        else
          while (error?.line == lineNumber)
            error = syntaxErrors[++syntaxErrorIndex];
      }

      lineNumber++;
    }
  }
}
