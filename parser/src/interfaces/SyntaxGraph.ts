import { State } from '#interfaces/State.js';
import { SubGraphTransition } from '#interfaces/SubGraphTransition.js';

/**
 * Represents a state transition graph comprising states, state transitions and sub-graphs
 * Sub-graphs are state transition graphs that are repeated in multiple places in the parent,
 * graph and avoid repetition. The same sub-graph can appear multiple times in a graph with
 * different transitions to/from other states.
 */
export type SyntaxGraph = {
    start: State;
    states: Map<string, State>;
    subGraphs: Map<string, SubGraphTransition>;
};
