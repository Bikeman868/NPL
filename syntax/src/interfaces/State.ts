import { StateTransition } from '#interfaces/StateTransition.js';

/**
 * Represents a state in a state transition diagram
 */
export type State = {
    /** The name of the state. Used only for internal references from state transitions unless this is the starting state */
    name: string;
    /** A list of the possible state transitions away from this state */
    transitions: StateTransition[];
    /** A list of names of sub-graphs that are valid when we are in this state */
    subGraphNames: string[];
};
