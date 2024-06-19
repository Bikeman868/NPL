import { Graph } from '../stateMachine/Graph.js';
import { GraphBuilder } from '../stateMachine/GraphBuilder.js';
import { buildKeywordParser, parseQualifiedIdentifier, skipSeparators } from '../stateMachine/SyntaxParser.js';

/* Examples

    network network1

    pipe namespace.pipe2

    process ns1.ns2.process1

*/

// prettier-ignore
export const destinationGraph: Graph = new GraphBuilder('routing-destination')
    .graph.start
        .transition('"network", "process", "pipe"', buildKeywordParser(['network', 'process', 'pipe'], 'Keyword'), skipSeparators, 'name')
    .graph.state('name')
        .transition('name', parseQualifiedIdentifier, skipSeparators)
    .graph.build();
