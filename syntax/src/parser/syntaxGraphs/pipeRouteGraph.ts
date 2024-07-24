import { GraphBuilder } from '../stateMachine/GraphBuilder.js';
import {
    skipSeparators,
    parseOpenScope,
    parseCloseScope,
} from '../stateMachine/SyntaxParser.js';
import {
    eolGraph,
    messageTypeSelectorGraph,
    parseRouteKeyword,
    routingStatementGraph,
} from '../index.js';

/* Examples

    route empty network network1<EOL>

    route * {
        clear
        prepend process process1
    }<EOL>

    route LogMessage {
        if message.level == LogLevel.debug {
            clear
        }
        elseif message.className == 'MyBuggyCLass' {
            append network logging.traceOutput
        }
    }<EOL>
*/

// prettier-ignore
export function definePipeRouteGraph(builder: GraphBuilder) {
    builder.clear()
    .graph.start
        .transition(parseRouteKeyword, skipSeparators, 'message-type')
    .graph.state('message-type')
        .subGraph('message-type', messageTypeSelectorGraph, 'identifier')
    .graph.state('identifier')
        .transition(parseOpenScope, skipSeparators, 'statements')
        .subGraph('empty-definition', eolGraph)
    .graph.state('statements')
        .transition(parseCloseScope, skipSeparators, 'end')
        .subGraph('blank-line', eolGraph, 'statements')
        .subGraph('routing-statement', routingStatementGraph, 'statements')
    .graph.state('end')
        .subGraph('end', eolGraph)
    .graph.build();
}
