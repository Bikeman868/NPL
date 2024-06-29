import { GraphBuilder } from '../stateMachine/GraphBuilder.js';
import {
    skipSeparators,
    parseQualifiedIdentifier,
} from '../stateMachine/SyntaxParser.js';
import {
    eolGraph,
    literalMessageGraph,
    messageContextGraph,
    messageMessageGraph,
    messageRouteGraph,
    parseEmitKeyword,
} from '../index.js';

// prettier-ignore
/* Examples

    empty route prepend network ns1.network1<EOL>

    TextMessage message text 'Hello, world'<EOL>

*/
const oneLineMessageDefinitionGraph = new GraphBuilder('one-line-message-definition')
    .graph.start
        .subGraph('message', messageMessageGraph)
        .subGraph('context', messageContextGraph)
        .subGraph('route', messageRouteGraph)
    .graph.build();

const emptyMessageTypeGraph = new GraphBuilder('empty-message-definition')
    .graph.start
        .transition(parseQualifiedIdentifier, skipSeparators, 'end')
    .graph.state('end')
        .subGraph('end', eolGraph)
    .graph.build();

// prettier-ignore
/* Examples
    emit empty<EOL>


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
        .subGraph('message-literal', literalMessageGraph)
        .subGraph('one-liner', oneLineMessageDefinitionGraph)
        .subGraph('empty', emptyMessageTypeGraph)
    .graph.build();
}
