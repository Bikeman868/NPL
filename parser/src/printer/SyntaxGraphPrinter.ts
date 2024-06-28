import { State } from "#interfaces/State";
import { SubGraphTransition } from "#interfaces/SubGraphTransition";
import { SyntaxGraph } from "#interfaces/SyntaxGraph.js";

function printState(state: State, subGraphs: Map<string, SubGraphTransition>, indent: number, stack: SyntaxGraph[]) {
    const indentation = '  '.repeat(indent);

    for (const transition of state.transitions) {
        const msg = `${indentation}${transition.parser.description}`
        if (transition.nextStateName) {
            console.log(msg + ' => "' + transition.nextStateName + '"');
        } else  {
            console.log(msg + ' =|');
        }
    }

    for (const subGraphName of state.subGraphNames) {
        const subGraph = subGraphs.get(subGraphName);
        if (subGraph) {
            console.log(`${indentation}${subGraph.graph.start.name} graph as ${subGraphName}`);
            printSyntaxGraph(subGraph.graph, indent + 1, stack);
        }
    }
}

export function printSyntaxGraph(graph: SyntaxGraph, indent: number = 0, stack?: SyntaxGraph[]) {
    if (!stack) stack = [];
    if (stack.includes(graph)) return;

    if (graph.start) {
        stack.push(graph);
        const indentation = '  '.repeat(indent);
        console.log(`${indentation}Starting conditions:`);

        printState(graph.start, graph.subGraphs, indent + 1, stack);

        for (const mapEntry of graph.states) {
            const stateName = mapEntry[0];
            const state = mapEntry[1]
            console.log(`${indentation}"${stateName}" state`);
            printState(state, graph.subGraphs, indent + 1, stack);
        }

        stack.pop();
    }
}
