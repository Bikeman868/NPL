import { IContext } from '#interfaces/IContext.js';
import { ParseResult } from '../ParseResult.js';
import { State } from '#interfaces/State.js';
import { whitespace } from '#interfaces/charsets.js';
import { StateTransition } from '#interfaces/StateTransition.js';
import { SyntaxGraph } from '#interfaces/SyntaxGraph.js';

enum GraphParsingOutcome {
    NotParsed,
    TransitionToInitialState,
    TransitionToNewState,
    SubGraphCompleted,
    RootGraphCompleted,
}

type GraphParsingResult = {
    parseResult?: ParseResult;
    outcome: GraphParsingOutcome;
};

/**
 * Tests if any of the start transitions or start sub-graphs in a graph match the input stream
 * If the input stream was parsed, then pushes a path to the next state if there is one.
 * If the input was not parsed, then the context path is not changed.
 * @param graphName is the name of this graph reference in the parent graph and is undefined if this it the root graph
 */
function tryStartGraph(context: IContext, syntaxGraph: SyntaxGraph, graphName: string | undefined): GraphParsingResult {
    context.trace(() => {
        // prettier-ignore
        return `Testing ${syntaxGraph.start.name}${graphName ? ':' + graphName : ''} graph`;
    });

    // Check for transitions to an initial state
    for (const transition of syntaxGraph.start.transitions) {
        context.trace(() => {
            return `Testing '${transition.parser.description}' transition`;
        });

        const parseResult = transition.parser.parseFunction(context);

        if (parseResult) {
            context.debug(() => {
                return `Found  ${parseResult.tokenType} in '${transition.parser.description}' transition`;
            });

            skipWhitespaceAfterTransition(context, transition);

            let outcome: GraphParsingOutcome;
            if (transition.nextStateName) {
                context.pushPath(graphName);
                context.pushPath(transition.nextStateName);
                outcome = GraphParsingOutcome.TransitionToInitialState;
            } else {
                if (graphName) outcome = GraphParsingOutcome.SubGraphCompleted;
                else outcome = GraphParsingOutcome.RootGraphCompleted;
            }

            return { parseResult, outcome };
        }
    }

    context.trace(() => {
        return `No matching start transitions in '${syntaxGraph.start.name}'}`;
    });

    // Assumne that we will be starting with a sub-graph and pop this later if not
    context.pushPath(graphName);

    for (const subGraphName of syntaxGraph.start.subGraphNames) {
        const subGraph = syntaxGraph.subGraphs.get(subGraphName);
        if (!subGraph)
            throw Error(`Internal error: No "${subGraphName}" sub-graph in "${syntaxGraph.start.name}" graph`);

        const subGraphResult = tryStartGraph(context, subGraph.graph, subGraphName);

        switch (subGraphResult.outcome) {
            case GraphParsingOutcome.NotParsed:
                context.trace(() => {
                    return `Sub-graph '${subGraphName}' does not match the input'}`;
                });
                break;
            case GraphParsingOutcome.SubGraphCompleted:
            case GraphParsingOutcome.RootGraphCompleted:
                context.debug(() => {
                    return `Sub-graph '${subGraphName}' parsed the input and exited`;
                });
                if (subGraph.nextStateName) {
                    context.pushPath(subGraph.nextStateName);
                    return {
                        parseResult: subGraphResult.parseResult,
                        outcome: GraphParsingOutcome.TransitionToInitialState,
                    };
                }
                return subGraphResult;
            case GraphParsingOutcome.TransitionToInitialState:
            case GraphParsingOutcome.TransitionToNewState:
                context.debug(() => {
                    return `Sub-graph '${subGraphName}' parsed the input and transitioned to a new state`;
                });
                return subGraphResult;
        }
    }

    // We are not starting this graph after all
    if (context.popPath() != graphName) throw Error(`Internal error: Popped sub-graph should have been "${graphName}"`);

    context.trace(() => {
        return `No matching start sub-graphs in '${syntaxGraph.start.name}'`;
    });
    return { outcome: GraphParsingOutcome.NotParsed };
}

/**
 * Tests if any of the transitions or sub-graphs leading from a graph state match the input stream
 * If the input stream was parsed, then pushes a path to the next state if there is one.
 * If there is no next state, then pops this graph off the path.
 * If there are no valid paths forward from the current state, then this is a syntax error.
 */
function parseFromState(
    context: IContext,
    syntaxGraph: SyntaxGraph,
    currentState: State,
    graphName: string | undefined,
): GraphParsingResult {
    context.debug(() => {
        return `Parsing from ${currentState.name} state`;
    });

    // Nomatter what, we are no longer in the current state
    if (context.popPath() != currentState.name)
        throw Error(`Internal error: Poped state should have been "${currentState.name}"`);

    // See if any state transitions match the input stream
    for (const transition of currentState.transitions) {
        context.trace(() => {
            return `Testing '${transition.parser.description}' transition`;
        });

        const parseResult = transition.parser.parseFunction(context);
        if (parseResult) {
            context.debug(() => {
                return `Found ${parseResult.tokenType} in '${transition.parser.description}' transition`;
            });

            skipWhitespaceAfterTransition(context, transition);

            let outcome: GraphParsingOutcome;
            if (transition.nextStateName) {
                context.pushPath(transition.nextStateName);
                outcome = GraphParsingOutcome.TransitionToNewState;
            } else {
                if (graphName) {
                    if (context.popPath() != graphName)
                        throw Error(`Internal error: Popped sub-graph should have been "${graphName}"`);
                    outcome = GraphParsingOutcome.SubGraphCompleted;
                } else {
                    outcome = GraphParsingOutcome.RootGraphCompleted;
                }
            }
            return { parseResult, outcome };
        }
    }

    // See if any of the sub-graphs match the input stream
    for (const subGraphName of currentState.subGraphNames) {
        const subGraph = syntaxGraph.subGraphs.get(subGraphName);
        if (!subGraph)
            throw Error(`Internal error: No "${subGraphName}" sub-graph in "${syntaxGraph.start.name}" graph`);

        const subGraphResult = tryStartGraph(context, subGraph.graph, subGraphName);

        switch (subGraphResult.outcome) {
            case GraphParsingOutcome.NotParsed:
                break;
            case GraphParsingOutcome.SubGraphCompleted:
            case GraphParsingOutcome.RootGraphCompleted:
                if (subGraph.nextStateName) {
                    context.trace(
                        () => `Sub-graph '${subGraphName}' completed with '${subGraph.nextStateName}' next state`,
                    );
                    context.pushPath(subGraph.nextStateName);
                    return {
                        parseResult: subGraphResult.parseResult,
                        outcome: GraphParsingOutcome.TransitionToNewState,
                    };
                } else {
                    context.trace(() => `Sub-graph '${subGraphName}' completed with no next state`);
                    if (graphName) {
                        if (context.popPath() != graphName)
                            throw Error(`Internal error: Popped graph should have been "${graphName}"`);
                    }
                }
                return subGraphResult;
            case GraphParsingOutcome.TransitionToInitialState:
            case GraphParsingOutcome.TransitionToNewState:
                return subGraphResult;
        }
    }

    noValidTransitions(context, syntaxGraph, currentState);
    return { outcome: GraphParsingOutcome.NotParsed };
}

/**
 * Logs a syntax error when there are no paths forwards on the syntax graph
 */
function noValidTransitions(context: IContext, syntaxGraph: SyntaxGraph, state: State): void {
    let options: string[] = listStateTransitions(state);

    for (const subGraphName of state.subGraphNames) {
        const subGraph = syntaxGraph.subGraphs.get(subGraphName);
        if (subGraph) {
            options = options.concat(listGraphStartOptions(subGraph.graph));
        }
    }

    if (options.length == 1) context.syntaxError('Expecting ' + options[0]);
    else if (options.length == 0) context.syntaxError('The language syntax is not defined beyond this point');
    else context.syntaxError('Expecting one of: ' + options.join(', '));
}

function skipWhitespaceAfterTransition(context: IContext, transition: StateTransition) {
    if (transition.whitespaceSkipper) {
        const startPosition = context.buffer.getPosition();
        transition.whitespaceSkipper(context);
        context.debug(() => {
            const endPosition = context.buffer.getPosition();
            const length = endPosition.offset - startPosition.offset;
            if (!length) return undefined;
            const spaces = context.buffer
                .getRaw(startPosition, length)
                .replace(/ /g, '.')
                .replace(/\n/g, 'n')
                .replace(/\r/g, 'r')
                .replace(/\t/g, 't');
            return `Skipped ${length} '${spaces}' after '${transition.parser.description}' transition`;
        });
    }
}

function listGraphStartOptions(syntaxGraph: SyntaxGraph): string[] {
    let options = listStateTransitions(syntaxGraph.start);

    for (const subGraphName of syntaxGraph.start.subGraphNames) {
        const subGraph = syntaxGraph.subGraphs.get(subGraphName);
        if (subGraph) {
            options = options.concat(listGraphStartOptions(subGraph.graph));
        }
    }

    return options;
}

function listStateTransitions(state: State): string[] {
    const options = [];

    for (const transition of state.transitions) {
        options.push(transition.parser.description);
    }

    return options;
}

/**
 * Recursively traverses the heirachy of nested sub-graphs to the end of the path to find the current state.
 * Tries to move forward from the current state by parsing the input stream.
 */
function parseGraphRecursive(
    context: IContext,
    syntaxGraph: SyntaxGraph,
    pathIndex: number,
    graphName: string | undefined,
): GraphParsingResult {
    const name = context.getPathElement(pathIndex);
    context.trace(() => name);

    if (pathIndex == context.pathLength - 1) {
        const state = syntaxGraph.states.get(name);
        if (!state) throw Error(`Internal error: No "${name}" state in "${syntaxGraph.start.name}" graph`);

        return parseFromState(context, syntaxGraph, state, graphName);
    } else {
        // Branches are sub-graphs
        const subGraph = syntaxGraph.subGraphs.get(name);
        if (!subGraph) throw Error(`Internal error: No "${name}" sub-graph in "${syntaxGraph.start.name}" graph`);
        const result = parseGraphRecursive(context, subGraph.graph, pathIndex + 1, name);
        switch (result.outcome) {
            case GraphParsingOutcome.SubGraphCompleted:
            case GraphParsingOutcome.RootGraphCompleted:
                if (subGraph.nextStateName) {
                    context.pushPath(subGraph.nextStateName);
                    result.outcome = GraphParsingOutcome.TransitionToNewState;
                } else {
                    if (graphName)
                        if (context.popPath() != graphName)
                            throw Error(`Internal error: Poped subgraph should be "${graphName}"`);
                }
                break;
        }
        return result;
    }
}

/**
 * Parses an input stream, extracting the next token and updating the parsing context
 */
export function parseNextToken(context: IContext): ParseResult | undefined {
    if (context.pathLength == 0) {
        const result = tryStartGraph(context, context.syntaxGraph, undefined);
        if (result.outcome == GraphParsingOutcome.NotParsed) {
            context.debug(() => 'Failed to parse root graph');
            context.buffer.skipAny(whitespace);
            if (!context.buffer.isEof()) {
                noValidTransitions(context, context.syntaxGraph, context.syntaxGraph.start);
            }
            return undefined;
        } else {
            return result.parseResult!;
        }
    } else {
        const result = parseGraphRecursive(context, context.syntaxGraph, 0, undefined);
        return result.parseResult;
    }
}
