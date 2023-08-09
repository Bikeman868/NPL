import { IParsable, Position } from '#interfaces/IParsable.js';
import { IContext, SyntaxError } from '#interfaces/IContext.js';
import { IParserState, StateName } from '#interfaces/IParserState';
import { ParserState } from './ParserState.js';

export class Context implements IContext {
  private _buffer: IParsable;
  private _position: Position;
  private _currentState: IParserState;
  private _stateStack: IParserState[];
  private _syntaxErrors: SyntaxError[];

  constructor(buffer: IParsable) {
    this._buffer = buffer;
    this._position = buffer.getPosition();
    this._currentState = new ParserState();
    this._stateStack = [];
    this._syntaxErrors = [];
  }

  get buffer() {
    return this._buffer;
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
    this._stateStack.push(new ParserState(this._currentState));
    if (state) this._currentState.state = state;
    if (subState) this._currentState.subState = subState;
    return this._currentState;
  }

  popState(): IParserState {
    const state = this._stateStack.pop();
    if (!state) throw new Error('More pops than pushes');
    this._currentState = state;
    return state;
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
    let indent = '';
    this._stateStack.forEach((s) => { indent += '  '; });
    console.log(indent + messageFunc());
  }
}
