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

  pushState(newState?: StateName): IParserState {
    this._stateStack.push(new ParserState(this._currentState));
    if (newState) this._currentState.state = newState;
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
    let state = '';
    this._stateStack.forEach((s) => (state += s.getDescription() + '\n'));
    state += this._currentState.getDescription();
    this._syntaxErrors.push({
      state,
      message,
      ...this._position,
    });
  }

  debug(messageFunc: () => any): void {
    console.log(messageFunc());
  }
}
