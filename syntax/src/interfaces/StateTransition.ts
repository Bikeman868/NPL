import { SyntaxParser } from '#interfaces/SyntaxParser.js';
import { WhitespaceSkipper } from '#interfaces/WhitespaceSkipper.js';

/**
 * Represents a transition between two states
 */
export type StateTransition = {
    /** The name of the state to transition to if the parses was able to parse the input stream */
    nextStateName: string | undefined;
    /** The function to call to try and parse the input stream */
    parser: SyntaxParser;
    /**The function to call to skip over whitespace */
    whitespaceSkipper: WhitespaceSkipper | undefined;
};
