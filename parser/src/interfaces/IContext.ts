import { IParsable } from '#interfaces/IParsable.js';
import { Position } from '#interfaces/Position.js';
import { IParserState } from '#interfaces/IParserState.js';
import { StateName } from '#interfaces/StateName.js';
import { SyntaxError } from '#interfaces/SyntaxError.js';

export interface IContext {
  readonly buffer: IParsable;
  readonly currentState: IParserState;
  readonly position: Position;
  readonly syntaxErrors: SyntaxError[];
  readonly isDryRun: boolean;

  debugLogging: (context: IContext) => boolean;

  pushState(state?: StateName, subState?: string): IParserState;
  popState(): IParserState;
  setState(state?: StateName, subState?: string): IParserState;
  setSubState(subState: string): IParserState;

  capturePosition(): void;
  restorePosition(): void;

  syntaxError(message: string): void;
  getDebugIndent(): string;
  debug(messageFunc: () => any): void;
}
