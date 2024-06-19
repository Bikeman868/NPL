import { openCurlyBracket, closeCurlyBracket } from '#interfaces/charsets.js';
import { GraphBuilder } from '../stateMachine/GraphBuilder.js';
import {
    buildKeywordParser,
    skipSeparators,
    parseQualifiedIdentifier,
    parseOpenScope,
    parseCloseScope,
} from '../stateMachine/SyntaxParser.js';
import { eolGraph } from './eolGraph.js';
import { messageMessageGraph } from './messageMessageGraph.js';
import { messageContextGraph } from './messageContextGraph.js';
import { messageRouteGraph } from './messageRouteGraph.js';

/* Examples
    expect empty<EOL>

    expect empty route prepend network ns1.network1<EOL>

    expect MessageType {
        context {
            origin {
                field value
            }
            message {
                field value
            }
        }
    }<EOL>

    expect aMessage {
        route {
            clear
            prepend process process2
        }
    }<EOL>

    expect messageClone {
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

const parseExpect = buildKeywordParser(['expect'], 'Keyword');
const parseEmpty = buildKeywordParser(['empty'], 'Keyword');

// prettier-ignore
export const expectGraph = new GraphBuilder('expect')
    .graph.start
        .transition('"expect"', parseExpect, skipSeparators, 'message-type')
    .graph.state('message-type')
        .transition('"empty"', parseEmpty, skipSeparators, 'definition')
        .transition('message or message type', parseQualifiedIdentifier, skipSeparators, 'definition')
    .graph.state('definition')
        .transition(openCurlyBracket, parseOpenScope, skipSeparators, 'constructor')
        .subGraph('empty-definition', eolGraph)
        .subGraph('single-message-message', messageMessageGraph)
        .subGraph('single-message-context', messageContextGraph)
        .subGraph('single-message-route', messageRouteGraph)
    .graph.state('constructor')
        .transition(closeCurlyBracket, parseCloseScope, skipSeparators, 'end')
        .subGraph('blank-line', eolGraph, 'constructor')
        .subGraph('message-message', messageMessageGraph, 'constructor')
        .subGraph('message-context', messageContextGraph, 'constructor')
        .subGraph('message-route', messageRouteGraph, 'constructor')
    .graph.state('end')
        .subGraph('end', eolGraph)
    .graph.build();
