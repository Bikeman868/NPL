import { openCurlyBracket, closeCurlyBracket } from '#interfaces/charsets.js';
import { GraphBuilder } from '../stateMachine/GraphBuilder.js';
import { buildKeywordParser, skipSeparators, parseOpenScope, parseCloseScope } from '../stateMachine/SyntaxParser.js';
import { routingStatementGraph } from './routingStatementGraph.js';
import { eolGraph } from './eolGraph.js';

/* Examples
    route clear<EOL>

    route {
        clear
        prepend process process1 {
            capture empty {
                emit MyMessage
            }
        }
    }<EOL>
*/

const parseRoute = buildKeywordParser(['route'], 'Keyword');

// prettier-ignore
export const messageRouteGraph = new GraphBuilder('route')
    .graph.start
        .transition('"route"', parseRoute, skipSeparators, 'route')
    .graph.state('route')
        .transition(openCurlyBracket, parseOpenScope, skipSeparators, 'statements')
        .subGraph('single-statement', routingStatementGraph)
    .graph.state('statements')
        .transition(closeCurlyBracket, parseCloseScope, skipSeparators, 'end')
        .subGraph('blank-line', eolGraph, 'statements')
        .subGraph('destination', routingStatementGraph, 'statements')
    .graph.state('end')
        .subGraph('end', eolGraph)
    .graph.build();
