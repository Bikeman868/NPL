import { IParsable, Position } from '#interfaces/IParsable.js';
import { IParserState, StateName } from '#interfaces/IParserState.js';

export type SyntaxError = {
  state: string;
  message: string;
} & Position;

export interface IContext {
  readonly buffer: IParsable;
  readonly currentState: IParserState;
  readonly position: Position;
  readonly syntaxErrors: SyntaxError[];

  pushState(newState?: StateName): IParserState;
  popState(): IParserState;
  capturePosition(): void;
  restorePosition(): void;
  syntaxError(message: string): void;
  debug(messageFunc: () => any): void;
}
