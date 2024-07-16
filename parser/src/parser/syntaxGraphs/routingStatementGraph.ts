import { GraphBuilder } from '../stateMachine/GraphBuilder.js';
import {
    skipSeparators,
    parseOpenScope,
    parseCloseScope,
} from '../stateMachine/SyntaxParser.js';
import {
    captureGraph,
    conditionalExpressionGraph,
    constGraph,
    destinationGraph,
    eolGraph,
    parseClearKeyword,
    parseConditionalKeyword,
    parseElseKeyword,
    parseForKeyword,
    parseRouteEndKeyword,
    routingStatementGraph,
    setGraph,
    varGraph,
} from '../index.js';

const statemenScopeBlockGraphBuilder: GraphBuilder = new GraphBuilder('route-scope-block');

// prettier-ignore
/** Examples
 * 
        clear
        append process ns1.process1
    }<EOL>

*/
statemenScopeBlockGraphBuilder
    .graph.start
        .subGraph('first-statement', routingStatementGraph, 'statements')
        .subGraph('blank-first-line', eolGraph, 'statements')
    .graph.state('statements')
        .transition(parseCloseScope, skipSeparators, 'end')
        .subGraph('blank-line', eolGraph, 'statements')
        .subGraph('next-statement', routingStatementGraph, 'statements')
    .graph.state('end')
        .subGraph('end', eolGraph)
    .graph.build();

// prettier-ignore
/* Examples

    clear<EOL>

    append process process1<EOL>

    prepend {
        process process1
        process process2
    }<EOL>

    capture MessageType {
        clear
        prepend network ns1.network1 {
            capture empty clear
        }
    }>EOL>

    if message.level == LogLevel.debug {
        clear
    }

    for i of [0, 1]
        prepend process logger
    }<EOL>

*/
export function defineRoutingStatementGraph(builder: GraphBuilder) {
    builder.clear()
    .graph.start
        .transition(parseClearKeyword, skipSeparators, 'end')
        .transition(parseRouteEndKeyword, skipSeparators, 'route')
        .transition(parseConditionalKeyword, skipSeparators, 'conditional')
        .transition(parseElseKeyword, skipSeparators, 'else')
        .transition(parseForKeyword, skipSeparators, 'for')
        .subGraph('capture', captureGraph)
        .subGraph('const', constGraph)
        .subGraph('var', varGraph)
        .subGraph('set', setGraph)
    .graph.state('route')
        .transition(parseOpenScope, skipSeparators, 'destinations')
        .subGraph('single-destination', destinationGraph)
    .graph.state('destinations')
        .transition(parseCloseScope, skipSeparators, 'end')
        .subGraph('blank-line', eolGraph, 'destinations')
        .subGraph('destination', destinationGraph, 'destinations')
    .graph.state('conditional')
        .subGraph('expression', conditionalExpressionGraph, 'conditional-eol')
    .graph.state('conditional-eol')
        .subGraph('conditional-eol', eolGraph, 'statements')
    .graph.state('statements')
        .subGraph('statements', statemenScopeBlockGraphBuilder.build())
    .graph.state('else')
        .transition(parseOpenScope, skipSeparators, 'statements')
        .subGraph('else-single-statement', routingStatementGraph)
    .graph.state('for')
        .subGraph('for', eolGraph) // TODO:
    .graph.state('end')
        .subGraph('end', eolGraph)
    .graph.build();
}
