import { GraphBuilder } from '#parser/stateMachine/GraphBuilder.js';
import { parseCloseScope, parseOpenScope, skipSeparators } from '../stateMachine/SyntaxParser.js';
import { destinationGraph, eolGraph } from '../index.js';

/* Examples
    process process1<EOL>

    { process process 1 }<EOL>

    { 
        process process1 
        network namespace.network1.entrypoint2
    }<EOL>

*/
// prettier-ignore
export function defineDestinationListGraph(builder: GraphBuilder) {
    builder.clear()
    .graph.start
        .transition(parseOpenScope, skipSeparators, 'scoped')
        .subGraph('single', destinationGraph, 'end')
    .graph.state('scoped')
        .subGraph('scoped-single', destinationGraph, 'scoped-single')
        .subGraph('destination-list', eolGraph, 'list')
    .graph.state('scoped-single')
        .transition(parseCloseScope, skipSeparators, 'end')
    .graph.state('list')
        .transition(parseCloseScope, skipSeparators, 'end')
        .subGraph('blank-line', eolGraph, 'list')
        .subGraph('destination', destinationGraph, 'destination-eol')
    .graph.state('destination-eol')
        .subGraph('destination-eol', eolGraph, 'list')
    .graph.state('end')
        .subGraph('end', eolGraph)
    .graph.build();
}
