import { GraphBuilder } from '../stateMachine/GraphBuilder.js';
import { skipSeparators, parseQualifiedIdentifier } from '../stateMachine/SyntaxParser.js';
import {
    eolGraph,
    literalMessageGraph,
    parseEmitKeyword,
    awaitGraph,
} from '../index.js';

// prettier-ignore
/* 
    This exists because transitions take priority over sub-graphs
    Examples

        myMessageVariable
*/
const identifierGraph = new GraphBuilder('identifier')
    .graph.start
        .transition(parseQualifiedIdentifier, skipSeparators)
    .graph.build();

// prettier-ignore
/* Examples

    emit empty {} await {
        TextMessage textMessage
        NotFound notFound
    }<EOL>

    emit myMessageVariable<EOL>

    emit myMessageVariable await Response<EOL>

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
    } await {
        NotFound notFound
        DataRow row
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
        .subGraph('message-literal', literalMessageGraph, 'await')
        .subGraph('identifier', identifierGraph, 'await')
    .graph.state('await')
        .subGraph('end', eolGraph)
        .subGraph('await', awaitGraph)
.graph.build();
}
