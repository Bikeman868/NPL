import { Position } from '#interfaces/Position.js';

/**
 * Defines a syntax error identified by the parser
 */
export type SyntaxError = {
    state: string;
    message: string;
} & Position;
