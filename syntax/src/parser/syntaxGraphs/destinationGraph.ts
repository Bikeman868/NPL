import { GraphBuilder } from '#parser/stateMachine/GraphBuilder.js';
import {
    parseCloseScope,
    parseOpenScope,
    parseQualifiedIdentifier,
    skipSeparators,
} from '../stateMachine/SyntaxParser.js';
import { captureGraph, eolGraph, parseDestinationKeyword } from '../index.js';

// prettier-ignore
/* Examples

    network network1<EOL>

    pipe namespace.pipe2<EOL>

    process ns1.ns2.process1<EOL>

    process process1 {
        capture MessageType {
            clear
            append process process2
        }
        capture empty {
            prepend process process1
        }
    }<EOL>

*/
export function defineDestinationGraph(builder: GraphBuilder) {
    builder.clear()
    .graph.start
        .transition(parseDestinationKeyword, skipSeparators, 'name')
    .graph.state('name')
        .transition(parseQualifiedIdentifier, skipSeparators, 'optional-captures')
    .graph.state('optional-captures')
        .transition(parseOpenScope, skipSeparators, 'capture-list')
        .subGraph('done', eolGraph)
    .graph.state('capture-list')
        .transition(parseCloseScope, skipSeparators, 'end')
        .subGraph('blank-line', eolGraph, 'capture-list')
        .subGraph('capture', captureGraph, 'capture-list')
    .graph.state('end')
        .subGraph('end', eolGraph)
    .graph.build();
}
