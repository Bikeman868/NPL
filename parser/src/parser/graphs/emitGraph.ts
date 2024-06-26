import { GraphBuilder } from '../stateMachine/GraphBuilder.js';
import {
    skipSeparators,
    parseQualifiedIdentifier,
    parseOpenScope,
    parseCloseScope,
} from '../stateMachine/SyntaxParser.js';
import {
    eolGraph,
    messageContextGraph,
    messageMessageGraph,
    messageRouteGraph,
    parseEmitKeyword,
    parseEmptyKeyword,
} from '../index.js';

// prettier-ignore
/* Examples
    emit empty<EOL>

    emit empty route prepend network ns1.network1<EOL>

    emit MessageType {
        context {
            origin {
                field value
            }
            message {
                field value
            }
        }
    }<EOL>

    emit aMessage {
        route {
            clear
            prepend process process2
        }
    }<EOL>

    emit messageClone {
        message {
            field1 value1
            field2 value2
        }
        context {
            message {
                context1 value1
                context2 value2
            }
            network {
                network1 value1
                network2 value2
            }
        }
        route {
            clear
            append pipe pipe1
        }
    }<EOL>
*/
export function defineEmitGraph(builder: GraphBuilder) {
    builder.clear()
    .graph.start
        .transition(parseEmitKeyword, skipSeparators, 'message-type')
    .graph.state('message-type')
        .transition(parseEmptyKeyword, skipSeparators, 'definition')
        .transition(parseQualifiedIdentifier, skipSeparators, 'definition')
    .graph.state('definition')
        .transition(parseOpenScope, skipSeparators, 'constructor')
        .subGraph('empty-definition', eolGraph)
        .subGraph('single-message-message', messageMessageGraph)
        .subGraph('single-message-context', messageContextGraph)
        .subGraph('single-message-route', messageRouteGraph)
    .graph.state('constructor')
        .transition(parseCloseScope, skipSeparators, 'end')
        .subGraph('blank-line', eolGraph, 'constructor')
        .subGraph('message-message', messageMessageGraph, 'constructor')
        .subGraph('message-context', messageContextGraph, 'constructor')
        .subGraph('message-route', messageRouteGraph, 'constructor')
    .graph.state('end')
        .subGraph('end', eolGraph)
    .graph.build();
}
