import { GraphBuilder } from '../stateMachine/GraphBuilder.js';
import { buildKeywordParser, skipSeparators, parseOpenScope, parseCloseScope } from '../stateMachine/SyntaxParser.js';
import { eolGraph, routingStatementGraph } from '../index.js';

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
export function defineMessageRouteGraph(builder: GraphBuilder) {
    builder.clear()
    .graph.start
        .transition(parseRoute, skipSeparators, 'route')
    .graph.state('route')
        .transition(parseOpenScope, skipSeparators, 'statements')
        .subGraph('single-statement', routingStatementGraph)
    .graph.state('statements')
        .transition(parseCloseScope, skipSeparators, 'end')
        .subGraph('blank-line', eolGraph, 'statements')
        .subGraph('destination', routingStatementGraph, 'statements')
    .graph.state('end')
        .subGraph('end', eolGraph)
    .graph.build();
}
