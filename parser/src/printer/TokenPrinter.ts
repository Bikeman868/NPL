import { IToken } from '#interfaces/IToken.js';

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

  private printKeyword() {
    if (!this.prevToken || this.prevToken.tokenType != 'Keyword') {
      this.newLine();

      const currentScope = this.scopeStack.at(-1);
      if (
        (['namespace', 'application', 'connection'].includes(this.token.text)) ||
        (currentScope == 'namespace' && ['network', 'message', 'enum'].includes(this.token.text)) ||
        (currentScope == 'network' && ['process', 'pipe', 'ingress', 'egress'].includes(this.token.text))
      ) {
        this.blankLine();
        this.nextScope = this.token.text;
      } else if (['process', 'pipe', 'ingress', 'egress'].includes(this.token.text)) {
        this.nextScope = this.token.text;
      }
    }

    this.cyan();
    this.write(this.token.text);
    this.defaultColor();
    this.write(' ');
  }

  private printParamStart() {
    this.red();
    this.write('(');
    this.defaultColor();
  }

  private printParamEnd() {
    this.red();
    this.write(')');
    this.defaultColor();
  }

  private printScopeStart() {
    this.yellow();
    this.write('{');
    this.defaultColor();
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
    this.yellow();
    this.write('}');
    this.defaultColor();
    this.newLine();
  }

  private printIdentifier() {
    this.red();
    this.write(this.token.text);
    this.defaultColor();
    this.write(' ');
  }

  private printExpression() {
    this.yellow();
    this.write(this.token.text);
    this.defaultColor();
    if (this.nextIsSingleLineComment) this.write('');
    else this.newLine();
  }

  private printComment() {
    const lines = this.token.text.split('\n').map((l) => l.trim());
    if (lines.length == 1) {
      this.green();
      this.write('// ');
      this.write(lines[0]);
      this.defaultColor();
      this.newLine();
      if (this.prevToken?.tokenType == 'ScopeStart') this.indent++;
    } else {
      this.newLine();
      this.green();
      this.write('/*');
      this.newLine();
      for (const line of lines) {
        this.write('  ');
        this.write(line);
        this.newLine();
      }
      this.write('*/');
      this.defaultColor();
      this.newLine();
    }
  }
}
