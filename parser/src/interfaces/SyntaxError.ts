import { Position } from '#interfaces/Position.js';

export type SyntaxError = {
  state: string;
  message: string;
} & Position;
