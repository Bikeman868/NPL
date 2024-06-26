import { GraphBuilder } from '#parser/stateMachine/GraphBuilder.js';
import { parseQualifiedIdentifier, skipSeparators } from '../stateMachine/SyntaxParser.js';
import { parseDestinationKeyword } from '../index.js';

// prettier-ignore
/* Examples

    network network1

    pipe namespace.pipe2

    process ns1.ns2.process1

*/
export function defineDestinationGraph(builder: GraphBuilder) {
    builder.clear()
    .graph.start
        .transition(parseDestinationKeyword, skipSeparators, 'name')
    .graph.state('name')
        .transition(parseQualifiedIdentifier, skipSeparators)
    .graph.build();
}
