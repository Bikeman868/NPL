// prettier-ignore

import { GraphBuilder } from '../stateMachine/GraphBuilder.js';
import { closeCurlyBracket } from '#interfaces/charsets.js';
import { buildSymbolParser, parseStartMessageLiteral, skipSeparators } from '../stateMachine/SyntaxParser.js';
import { eolGraph, messageContextGraph, messageMessageGraph, messageRouteGraph } from './index.js';

const parseEndMessage = buildSymbolParser(closeCurlyBracket, 'EndMessageLiteral');

// prettier-ignore
/* Examples

    namespace1.MyMessage { 
        message fieldName 'string value'
    }<EOL>

    message1 {
        message {
            field1 field1Value
            field2 field2Value
            field3 field3Value
        }
    }<EOL>

*/
export function defineMessageLiteralGraph(builder: GraphBuilder) {
    builder.clear()
    .graph.start
        .transition('message type', parseStartMessageLiteral, skipSeparators, 'message')
    .graph.state('message')
        .transition(closeCurlyBracket, parseEndMessage, skipSeparators, 'end')
        .subGraph('blank-line', eolGraph, 'message')
        .subGraph('message-message', messageMessageGraph, 'message')
        .subGraph('message-context', messageContextGraph, 'message')
        .subGraph('message-route', messageRouteGraph, 'message')
    .graph.state('end')
        .subGraph('end', eolGraph)
    .graph.build();
}
