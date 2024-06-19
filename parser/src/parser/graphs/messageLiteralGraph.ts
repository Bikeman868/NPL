// prettier-ignore

import { GraphBuilder } from '../stateMachine/GraphBuilder.js';
import { closeCurlyBracket, openCurlyBracket } from '#interfaces/charsets.js';
import { messageMessageGraph } from './messageMessageGraph.js';
import { messageContextGraph } from './messageContextGraph.js';
import { messageRouteGraph } from './messageRouteGraph.js';
import { buildSymbolParser, parseStartMessageLiteral, skipSeparators } from '../stateMachine/SyntaxParser.js';
import { eolGraph } from './eolGraph.js';

const parseEndMessage = buildSymbolParser(closeCurlyBracket, 'EndMessageLiteral');

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
export const messageLiteralGraph = new GraphBuilder('message-literal').graph.start
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
