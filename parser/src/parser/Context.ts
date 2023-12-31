import { IParsable } from '#interfaces/IParsable.js';
import { Position } from '#interfaces/Position.js';
import { IContext } from '#interfaces/IContext.js';
import { SyntaxError } from '#interfaces/SyntaxError.js';
import { IParserState } from '#interfaces/IParserState';
import { StateName } from '#interfaces/StateName.js';
import { ParserState } from './ParserState.js';

export class Context implements IContext {
  private _buffer: IParsable;
  private _position: Position;
  private _currentState: IParserState;
  private _stateStack: IParserState[];
  private _syntaxErrors: SyntaxError[];
  private _isDryRun: boolean;

  debugLogging: (context: IContext) => boolean = () => false;

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

  set isDryRun(enabled: boolean) {
    this._isDryRun = enabled;
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

  /**
   * Pushes the current state onto a stack, and changes the current state and sub-state
   * If the sub-state is not specified then the sub-state will be set to 'start'
   */
  pushState(state: StateName, subState?: string): IParserState {
    this.debug(
      () =>
        `${this.getDebugIndent()}${this._currentState.state}.${
          this._currentState.subState
        } => ${state}.${subState || 'start'}`,
    );

    if (!this._isDryRun) {
      this._stateStack.push(new ParserState(this._currentState));
      if (state) this._currentState.state = state;
      this._currentState.subState = subState || 'start';
    }

    return this._currentState;
  }

  /**
   * Pushes the current state on the stack and changes the sub-state
   */
  pushSubState(subState: string): IParserState {
    this.debug(
      () =>
        `${this.getDebugIndent()}${this._currentState.state}.${
          this._currentState.subState
        } => ${this._currentState.state}.${subState}`,
    );

    if (!this._isDryRun) {
      this._stateStack.push(new ParserState(this._currentState));
      this._currentState.subState = subState;
    }

    return this._currentState;
  }

  popState(): IParserState {
    const oldState = this._currentState.state;
    const oldSubState = this._currentState.subState;

    if (!this._isDryRun) {
      const popedState = this._stateStack.pop();
      if (!popedState) throw new Error('More pops than pushes');
      this._currentState = popedState;
    }

    this.debug(
      () =>
        `${this.getDebugIndent()}${this._currentState.state}.${
          this._currentState.subState
        } <= ${oldState}.${oldSubState}`,
    );

    return this._currentState;
  }

  setState(state?: StateName, subState?: string): IParserState {
    this.debug(
      () => `${this.getDebugIndent()}*.* --> ${state}.${subState || 'start'}`,
    );

    if (!this._isDryRun) {
      if (state) this._currentState.state = state;
      this._currentState.subState = subState || 'start';
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
    for (const s of this._stateStack) {
      state += stackDepth + s.getDescription() + '\n';
      stackDepth += '  ';
    }
    state += stackDepth + this._currentState.getDescription();

    this._syntaxErrors.push({
      state,
      message,
      ...this._position,
    });
  }

  debug(messageFunc: () => any): void {
    if (this.debugLogging(this)) {
      const lineNumber = ('00' + this._position.line).slice(-3);
      console.log(lineNumber + ' ' + messageFunc());
    }
  }

  getDebugIndent(): string {
    let indent = '';

    if (this.debugLogging(this)) {
      this._stateStack.forEach(() => {
        indent += '  ';
      });
    }

    return indent;
  }
}
