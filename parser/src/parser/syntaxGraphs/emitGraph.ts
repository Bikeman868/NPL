import { GraphBuilder } from '../stateMachine/GraphBuilder.js';
import {
    skipSeparators,
    parseQualifiedIdentifier,
} from '../stateMachine/SyntaxParser.js';
import {
    eolGraph,
    literalMessageGraph,
    messageContextGraph,
    messageJsonGraph,
    messageMessageGraph,
    messageRouteGraph,
    parseEmitKeyword,
    parseEmptyKeyword,
} from '../index.js';

// prettier-ignore
/* Examples

    empty route prepend network ns1.network1<EOL>

    TextMessage message text 'Hello, world'<EOL>

    empty<EOL>

    MyTriger<EOL>

    Response json '{}'

*/
const oneLineMessageDefinitionGraph = new GraphBuilder('one-line-message-definition')
    .graph.start
        .transition(parseEmptyKeyword, skipSeparators, 'definition')
        .transition(parseQualifiedIdentifier, skipSeparators, 'definition')
    .graph.state('definition')
        .subGraph('message', messageMessageGraph)
        .subGraph('context', messageContextGraph)
        .subGraph('route', messageRouteGraph)
        .subGraph('json', messageJsonGraph)
        .subGraph('empty', eolGraph)
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
    .graph.build();
}
