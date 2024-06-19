import { openCurlyBracket, closeCurlyBracket } from '#interfaces/charsets.js';
import { GraphBuilder } from '../stateMachine/GraphBuilder.js';
import {
    buildKeywordParser,
    buildSymbolParser,
    skipSeparators,
    parseQualifiedIdentifier,
    parseOpenScope,
    parseCloseScope,
} from '../stateMachine/SyntaxParser.js';
import { routingStatementGraph } from './routingStatementGraph.js';
import { eolGraph } from './eolGraph.js';

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

const parseRoute = buildKeywordParser(['route'], 'Keyword');
const parseEmpty = buildKeywordParser(['empty'], 'Keyword');
const parseAnyType = buildSymbolParser('*', 'Keyword');

// prettier-ignore
export const pipeRouteGraph = new GraphBuilder('pipe-route')
    .graph.start
        .transition('"route"', parseRoute, skipSeparators, 'message-type')
    .graph.state('message-type')
        .transition('"empty"', parseEmpty, skipSeparators, 'identifier')
        .transition('"*"', parseAnyType, skipSeparators, 'identifier')
        .transition('the type of message to route', parseQualifiedIdentifier, skipSeparators, 'identifier')
    .graph.state('identifier')
        .transition(openCurlyBracket, parseOpenScope, skipSeparators, 'statements')
        .subGraph('empty-definition', eolGraph)
    .graph.state('statements')
        .transition(closeCurlyBracket, parseCloseScope, skipSeparators, 'end')
        .subGraph('blank-line', eolGraph, 'statements')
        .subGraph('routing statement', routingStatementGraph, 'statements')
    .graph.state('end')
        .subGraph('end', eolGraph)
    .graph.build();
