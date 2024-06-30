import { closeCurlyBracket, openCurlyBracket } from '#interfaces/charsets.js';
import { GraphBuilder } from '../stateMachine/GraphBuilder.js';
import {
    buildCloseScopeParser,
    skipSeparators,
    parseQualifiedIdentifier,
    parseOpenScope,
    parseCloseScope,
} from '../stateMachine/SyntaxParser.js';
import {
    conditionalExpressionGraph,
    destinationGraph,
    eolGraph,
    parseAnyMessageTypeKeyword,
    parseCaptureKeyword,
    parseClearKeyword,
    parseConditionalKeyword,
    parseElseKeyword,
    parseEmptyKeyword,
    parseForKeyword,
    parseRouteEndKeyword,
    routingStatementGraph,
} from '../index.js';

const statemenScopeBlockGraphBuilder: GraphBuilder = new GraphBuilder('route-scope-block');
const captureGraphBuilder = new GraphBuilder('route-message-capture');

// prettier-ignore
/* Examples

    capture * clear<EOL>

    capture empty {
        clear
        append process ns1.process1
    }<EOL>

*/
captureGraphBuilder
    .graph.start
        .transition(parseCaptureKeyword, skipSeparators, 'message-type')
    .graph.state('message-type')
        .transition(parseEmptyKeyword, skipSeparators, 'identifier')
        .transition(parseAnyMessageTypeKeyword, skipSeparators, 'identifier')
        .transition(parseQualifiedIdentifier, skipSeparators, 'identifier')
    .graph.state('identifier')
        .transition(parseOpenScope, skipSeparators, 'statements')
        .subGraph('single-route', routingStatementGraph)
    .graph.state('statements')
        .transition(parseCloseScope, skipSeparators, 'end')
        .subGraph('blank-line', eolGraph, 'statements')
        .subGraph('multi-route', routingStatementGraph, 'statements')
    .graph.state('end')
        .subGraph('end', eolGraph)
    .graph.build();

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
        prepend network ns1.network1
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
        .subGraph('"capture"', captureGraphBuilder.build())
    .graph.state('route')
        .transition(parseOpenScope, skipSeparators, 'destinations')
        .subGraph('single-destination', destinationGraph, 'end')
    .graph.state('destinations')
        .transition(buildCloseScopeParser(), skipSeparators, 'end')
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
