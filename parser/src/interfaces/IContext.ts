import { IParsable, Position } from '#interfaces/IParsable.js';
import { IParserState } from '#interfaces/IParserState.js';

export interface IContext {
  readonly buffer: IParsable;
  readonly currentState: IParserState;
  readonly position: Position;

  pushState(): void;
  popState(): void;
  capturePosition(): void;
  restorePosition(): void;
}
