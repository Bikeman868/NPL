export class SyntaxErrorPrinter {
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
}
