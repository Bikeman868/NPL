import { IParsable, Position } from '#interfaces/IParsable.js';
import { IContext } from '#interfaces/IContext.js';
import { IParserState } from '#interfaces/IParserState';
import { ParserState } from './ParserState.js';

export class Context implements IContext {
  private _buffer: IParsable;
  private _position: Position;
  private _currentState: IParserState;
  private _stateStack: IParserState[];

  constructor(buffer: IParsable) {
    this._buffer = buffer;
    this._position = buffer.getPosition();
    this._currentState = new ParserState();
    this._stateStack = [];
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

  pushState() {
    this._stateStack.push(new ParserState(this._currentState));
  }

  popState() {
    const state = this._stateStack.pop();
    if (!state) throw new Error('More pops than pushes');
    this._currentState = state;
  }

  capturePosition() {
    this._position = this._buffer.getPosition();
  }

  restorePosition() {
    this._buffer.setPosition(this._position);
  }
}
