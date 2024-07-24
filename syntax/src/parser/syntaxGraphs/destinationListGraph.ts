import { GraphBuilder } from '#parser/stateMachine/GraphBuilder.js';
import { parseCloseScope, parseOpenScope, skipSeparators } from '../stateMachine/SyntaxParser.js';
import { destinationGraph, eolGraph } from '../index.js';

/* Examples
    process process1<EOL>

    process process1 { 
        capture MessageType append pipe pipe2
    }<EOL>

    { 
        process process1 
        network namespace.network1.entrypoint2
        process process2 {
            capture MessageType {
                clear
                append process2
            }
        }
    }<EOL>

*/
// prettier-ignore
export function defineDestinationListGraph(builder: GraphBuilder) {
    builder.clear()
    .graph.start
        .transition(parseOpenScope, skipSeparators, 'scoped')
        .subGraph('single', destinationGraph)
    .graph.state('scoped')
        .transition(parseCloseScope, skipSeparators, 'end')
        .subGraph('blank-line', eolGraph, 'scoped')
        .subGraph('destination', destinationGraph, 'scoped')
    .graph.state('end')
        .subGraph('end', eolGraph)
    .graph.build();
}
