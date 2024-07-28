import { GraphBuilder } from '../stateMachine/GraphBuilder.js';
import { skipSeparators, parseOpenScope, parseCloseScope } from '../stateMachine/SyntaxParser.js';
import { eolGraph, messageTypeSelectorGraph, parseCaptureKeyword, routingStatementGraph } from '../index.js';

// prettier-ignore
/* Examples

    capture * clear<EOL>

    capture empty {
        clear
        append process ns1.process1
    }<EOL>

    capture MyMessage<EOL>

*/
export function defineCaptureGraph(builder: GraphBuilder) {
    builder.clear()
    .graph.start
        .transition(parseCaptureKeyword, skipSeparators, 'message-type')
    .graph.state('message-type')
        .subGraph('message-type', messageTypeSelectorGraph, 'identifier')
    .graph.state('identifier')
        .transition(parseOpenScope, skipSeparators, 'statements')
        .subGraph('clear-capture', eolGraph)
        .subGraph('single-route', routingStatementGraph)
    .graph.state('statements')
        .transition(parseCloseScope, skipSeparators, 'end')
        .subGraph('blank-line', eolGraph, 'statements')
        .subGraph('multi-route', routingStatementGraph, 'statements')
    .graph.state('end')
        .subGraph('end', eolGraph)
    .graph.build();
}
