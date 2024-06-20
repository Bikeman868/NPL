import { closeCurlyBracket, openCurlyBracket } from '#interfaces/charsets.js';
import { GraphBuilder } from '../stateMachine/GraphBuilder.js';
import {
    buildCloseScopeParser,
    skipSeparators,
    parseQualifiedIdentifier,
    parseOpenScope,
    parseCloseScope,
} from '../stateMachine/SyntaxParser.js';
import { conditionalExpressionGraph, destinationGraph, eolGraph, parseAnyMessageTypeKeyword, parseCaptureKeyword, parseClearKeyword, parseConditionalKeyword, parseElseKeyword, parseEmptyKeyword, parseForKeyword, parseRouteEndKeyword } from './index.js';

const statementGraphBuilder = new GraphBuilder('routing-statement');
const statemenScopeBlockGraphBuilder: GraphBuilder = new GraphBuilder('route-scope-block');
const captureGraphBuilder = new GraphBuilder('route-message-capture');

// prettier-ignore
/* Examples

    capture * clear<EOL>

    capture empty {
        clear
        append process ns1.process1
    }

*/
captureGraphBuilder
    .graph.start
        .transition('"capture"', parseCaptureKeyword, skipSeparators, 'message-type')
    .graph.state('message-type')
        .transition('"empty"', parseEmptyKeyword, skipSeparators, 'identifier')
        .transition('"*"', parseAnyMessageTypeKeyword, skipSeparators, 'identifier')
        .transition('the type of message to capture', parseQualifiedIdentifier, skipSeparators, 'identifier')
    .graph.state('identifier')
        .transition(openCurlyBracket, parseOpenScope, skipSeparators, 'statements')
        .subGraph('single-route', statementGraphBuilder.build())
    .graph.state('statements')
        .transition(closeCurlyBracket, parseCloseScope, skipSeparators, 'end')
        .subGraph('blank-line', eolGraph, 'statements')
        .subGraph('multi-route', statementGraphBuilder.build(), 'statements')
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
        .subGraph('first-statement', statementGraphBuilder.build(), 'statements')
    .graph.state('statements')
        .transition(closeCurlyBracket, parseCloseScope, skipSeparators, 'end')
        .subGraph('blank-line', eolGraph, 'statements')
        .subGraph('next-statement', statementGraphBuilder.build(), 'statements')
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
        .transition('"clear"', parseClearKeyword, skipSeparators, 'end')
        .transition('"append", "prepend"', parseRouteEndKeyword, skipSeparators, 'route')
        .transition('"if", "elseif", "while"', parseConditionalKeyword, skipSeparators, 'conditional')
        .transition('"else"', parseElseKeyword, skipSeparators, 'else')
        .transition('"for"', parseForKeyword, skipSeparators, 'for')
        .subGraph('"capture"', captureGraphBuilder.build())
    .graph.state('route')
        .transition(openCurlyBracket, parseOpenScope, skipSeparators, 'destinations')
        .subGraph('single-destination', destinationGraph, 'end')
    .graph.state('destinations')
        .transition(closeCurlyBracket, buildCloseScopeParser(), skipSeparators, 'end')
        .subGraph('blank-line', eolGraph, 'destinations')
        .subGraph('destination', destinationGraph, 'destinations')
    .graph.state('conditional')
        .subGraph('expression', conditionalExpressionGraph, 'conditional-eol')
    .graph.state('conditional-eol')
        .subGraph('conditional-eol', eolGraph, 'conditional-statement')
    .graph.state('conditional-statement')
        .subGraph('statements', statemenScopeBlockGraphBuilder.build())
    .graph.state('else')
        .subGraph('else', eolGraph) // TODO:
    .graph.state('for')
        .subGraph('for', eolGraph) // TODO:
    .graph.state('end')
        .subGraph('end', eolGraph)
    .graph.build();
}
