import { SyntaxParser, WhitespaceSkipper } from './SyntaxParser.js';

/**
 * Represents a transition between two states
 */
export type StateTransition = {
    /** This is used in syntax errors to descibe what was expected in the source */
    description: string;
    /** The name of the state to transition to if the parses was able to parse the input stream */
    nextStateName: string | undefined;
    /** The function to call to try and parse the input stream */
    parser: SyntaxParser;
    /**The function to call to skip over whitespace */
    whitespaceSkipper: WhitespaceSkipper | undefined;
};
