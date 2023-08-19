import { IToken } from '#interfaces/IToken.js';
import consoleEscape from './consoleEscape.js';
import textStyle from './consoleEscape.js';

export class TokenPrinter {
  private output: (line: string) => void;
  private token!: IToken;
  private nextToken?: IToken;
  private prevToken?: IToken;
  private scopeStack: string[];
  private nextScope?: string;
  private nextIsSingleLineComment!: boolean;
  private indent: number;
  private line: string;
  private tokens: IToken[];

  includeConsoleColors: boolean = false;

  constructor(tokens: IToken[], output?: (line: string) => void) {
    this.tokens = tokens;
    this.indent = 0;
    this.line = '';
    this.nextToken = tokens[0];
    this.scopeStack = [];

    this.output =
      output ||
      ((line) => {
        console.log(line);
      });
  }

  print() {
    if (!this.tokens || this.tokens.length == 0) return;

    for (var index = 0; index < this.tokens.length; index++) {
      this.prevToken = this.token;
      this.token = this.nextToken!;
      this.nextToken =
        index < this.tokens.length - 1 ? this.tokens[index + 1] : undefined;

      if (this.nextToken && this.nextToken.tokenType == 'Comment') {
        const lines = this.nextToken.text.split('\n');
        this.nextIsSingleLineComment = lines.length == 1;
      } else {
        this.nextIsSingleLineComment = false;
      }

      switch (this.token!.tokenType) {
        case 'Keyword':
          this.printKeyword();
          break;
        case 'ParamStart':
          this.printParamStart();
          break;
        case 'ParamEnd':
          this.printParamEnd();
          break;
        case 'ScopeStart':
          this.printScopeStart();
          break;
        case 'ScopeEnd':
          this.printScopeEnd();
          break;
        case 'QualifiedIdentifier':
        case 'Identifier':
          this.printIdentifier();
          break;
        case 'Constant':
        case 'Expression':
          this.printExpression();
          break;
        case 'Comment':
          this.printComment();
          break;
        case 'String':
          this.printString();
          break;
        case 'Boolean':
        case 'Number':
          this.printLiteral();
          break;
        case 'OpenParenthesis':
        case 'CloseParenthesis':
        case 'Operator':
          this.printOperator();
          break;
        default:
          this.write(this.token.text);
          this.write(' ');
          break;
      }
    }
  }

  private write(text: string) {
    this.line += text;
  }

  private newLine() {
    if (this.line) {
      let indent = '';
      for (let i = 0; i < this.indent; i++) indent += '  ';
      this.output(indent + this.line);
      this.line = '';
    }
  }

  private blankLine() {
    this.output('');
  }

  private setStyle(...escapeCodes: string[]) {
    if (this.includeConsoleColors)
      for (const code of escapeCodes) this.write(code);
  }

  private resetStyle() {
    if (this.includeConsoleColors) this.write(consoleEscape.reset);
  }

  private printKeyword() {
    if (!this.prevToken || this.prevToken.tokenType != 'Keyword') {
      this.newLine();

      const currentScope = this.scopeStack.at(-1);
      if (
        ['namespace', 'application', 'connection'].includes(this.token.text) ||
        (currentScope == 'namespace' &&
          ['network', 'message', 'enum'].includes(this.token.text)) ||
        (currentScope == 'network' &&
          ['process', 'pipe', 'ingress', 'egress'].includes(this.token.text))
      ) {
        this.blankLine();
        this.nextScope = this.token.text;
      } else if (
        ['process', 'pipe', 'ingress', 'egress'].includes(this.token.text)
      ) {
        this.nextScope = this.token.text;
      }
    }

    this.setStyle(consoleEscape.cyan, consoleEscape.bold);
    this.write(this.token.text);
    this.resetStyle();
    this.write(' ');
  }

  private printParamStart() {
    this.setStyle(consoleEscape.red);
    this.write('(');
    this.resetStyle();
  }

  private printParamEnd() {
    this.setStyle(consoleEscape.red);
    this.write(')');
    this.resetStyle();
  }

  private printScopeStart() {
    this.setStyle(consoleEscape.yellow);
    this.write('{');
    this.resetStyle();
    if (this.nextIsSingleLineComment) this.write(' ');
    else {
      this.newLine();
      this.indent++;
    }
    this.scopeStack.push(this.nextScope || '');
  }

  private printScopeEnd() {
    this.scopeStack.pop();
    this.newLine();
    this.indent--;
    this.setStyle(consoleEscape.yellow);
    this.write('}');
    this.resetStyle();
    this.newLine();
  }

  private printIdentifier() {
    this.setStyle(consoleEscape.red);
    this.write(this.token.text);
    this.resetStyle();
    this.write(' ');
  }

  private printExpression() {
    this.setStyle(consoleEscape.yellow);
    this.write(this.token.text);
    this.resetStyle();
    if (this.nextIsSingleLineComment) this.write(' ');
    else this.newLine();
  }

  private printString() {
    const escaped = this.token.text
      .replace('\n', '\\n')
      .replace('\t', '\\t')
      .replace('\r', '\\r')
      .replace('\f', '\\f')
      .replace('\\', '\\')
      .replace("'", "\\'");
    this.setStyle(consoleEscape.yellow);
    this.write("'");
    this.write(escaped);
    this.write("'");
    this.resetStyle();
  }

  private printLiteral() {
    this.setStyle(consoleEscape.yellow);
    this.write(this.token.text);
    this.resetStyle();
  }

  private printOperator() {
    this.write(this.token.text);
  }

  private printComment() {
    const lines = this.token.text.split('\n').map((l) => l.trim());
    if (lines.length == 1) {
      this.setStyle(consoleEscape.green, consoleEscape.dim);
      this.write('// ');
      this.write(lines[0]);
      this.resetStyle();
      this.newLine();
      if (this.prevToken?.tokenType == 'ScopeStart') this.indent++;
    } else {
      this.newLine();
      this.setStyle(consoleEscape.green, consoleEscape.dim);
      this.write('/*');
      this.newLine();
      for (const line of lines) {
        this.write('  ');
        this.write(line);
        this.newLine();
      }
      this.write('*/');
      this.resetStyle();
      this.newLine();
    }
  }
}
