import { IParsable } from '#interfaces/IParsable.js';
import { Position } from '#interfaces/Position.js';
import { IContext, SyntaxError } from '#interfaces/IContext.js';
import { IParserState, StateName } from '#interfaces/IParserState';
import { ParserState } from './ParserState.js';

export class Context implements IContext {
  private _buffer: IParsable;
  private _position: Position;
  private _currentState: IParserState;
  private _stateStack: IParserState[];
  private _syntaxErrors: SyntaxError[];
  private _isDryRun: boolean;

  debugLogging: boolean = false;

  constructor(buffer: IParsable, isDryRun?: boolean) {
    this._buffer = buffer;
    this._isDryRun = !!isDryRun;
    this._position = buffer.getPosition();
    this._currentState = new ParserState();
    this._stateStack = [];
    this._syntaxErrors = [];
  }

  get buffer() {
    return this._buffer;
  }

  get isDryRun() {
    return this._isDryRun;
  }

  get currentState(): IParserState {
    return this._currentState;
  }

  get position(): Position {
    return this._position;
  }

  get syntaxErrors(): SyntaxError[] {
    return this._syntaxErrors;
  }

  pushState(state?: StateName, subState?: string): IParserState {
    this.debug(
      () =>
        `${this.getDebugIndent()}${this._currentState.state}.${
          this._currentState.subState
        } => ${state}.${subState}`,
    );

    if (!this._isDryRun) {
      this._stateStack.push(new ParserState(this._currentState));
      if (state) this._currentState.state = state;
      if (subState) this._currentState.subState = subState;
    }

    return this._currentState;
  }

  popState(): IParserState {
    const state = this._currentState.state;
    const subState = this._currentState.subState;

    if (!this._isDryRun) {
      const popedState = this._stateStack.pop();
      if (!popedState) throw new Error('More pops than pushes');
      this._currentState = popedState;
    }

    this.debug(
      () =>
        `${this.getDebugIndent()}${this._currentState.state}.${
          this._currentState.subState
        } <= ${state}.${subState}`,
    );

    return this._currentState;
  }

  setState(state?: StateName, subState?: string): IParserState {
    this.debug(() => `${this.getDebugIndent()}*.* --> ${state}.${subState}`);

    if (!this._isDryRun) {
      if (state) this._currentState.state = state;
      if (subState) this._currentState.subState = subState;
    }
    return this._currentState;
  }

  setSubState(subState: string): IParserState {
    this.debug(
      () =>
        `${this.getDebugIndent()}*.${
          this._currentState.subState
        } --> *.${subState}`,
    );

    if (!this._isDryRun) {
      this._currentState.subState = subState;
    }

    return this._currentState;
  }

  capturePosition() {
    this._position = this._buffer.getPosition();
  }

  restorePosition() {
    this._buffer.setPosition(this._position);
  }

  syntaxError(message: string): void {
    this.debug(() => 'Syntax error "' + message + '"');
    let state = '';
    let stackDepth = '';
    this._stateStack.forEach((s) => {
      state += stackDepth + s.getDescription() + '\n';
      stackDepth += '  ';
    });
    state += this._currentState.getDescription();
    this._syntaxErrors.push({
      state,
      message,
      ...this._position,
    });
  }

  debug(messageFunc: () => any): void {
    if (this.debugLogging) console.log(messageFunc());
  }

  getDebugIndent(): string {
    let indent = '';

    if (this.debugLogging) {
      this._stateStack.forEach((s) => {
        indent += '  ';
      });
    }

    return indent;
  }
}
