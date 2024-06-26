import { SyntaxGraph } from '#interfaces/SyntaxGraph.js';

/**
 * Represents a possible transition to a new state via a sub-graph
 */
export type SubGraphTransition = {
    /**
     * The sub-graph to use for parsing the input stream
     */
    graph: SyntaxGraph;
    /**
     * The state to transition to when the sub-graph completes, or undefined to return from this graph
     */
    nextStateName: string | undefined;
};
