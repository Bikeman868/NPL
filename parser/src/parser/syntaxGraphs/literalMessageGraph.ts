import { GraphBuilder } from '../stateMachine/GraphBuilder.js';
import { parseQualifiedIdentifier, parseStartMessageLiteral, skipSeparators } from '../stateMachine/SyntaxParser.js';
import {
    eolGraph,
    messageContextGraph,
    messageJsonGraph,
    messageMessageGraph,
    messageRouteGraph,
    parseEndMessageSymbol,
    parseSpreadOperator,
} from '../index.js';

// prettier-ignore
/* Examples

    namespace1.MyMessage { 
        message fieldName 'string value'
    }

    message1 {
        message {
            ...anotherMessage
            field1 field1Value
            field2 field2Value
            field3 {
                key1 value1
                key2 value2
            }
        }
    }

    empty {
        route prepend process process1
    }

    MyMessage {
        json '{"name": "My name"}'
    }

    myMessage {
    }

*/
export function defineLiteralMessageGraph(builder: GraphBuilder) {
    builder.clear()
    .graph.start
        .transition(parseStartMessageLiteral, skipSeparators, 'message')
    .graph.state('message')
        .transition(parseEndMessageSymbol, skipSeparators)
        .subGraph('blank-line', eolGraph, 'message')
        .subGraph('message', messageMessageGraph, 'message')
        .subGraph('json', messageJsonGraph, 'message')
        .subGraph('context', messageContextGraph, 'message')
        .subGraph('route', messageRouteGraph, 'message')
    .graph.build();
}
