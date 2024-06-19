import { closeCurlyBracket, openCurlyBracket } from '#interfaces/charsets.js';
import { GraphBuilder } from '../stateMachine/GraphBuilder.js';
import {
    buildKeywordParser,
    buildCloseScopeParser,
    skipSeparators,
    parseQualifiedIdentifier,
    parseOpenScope,
    parseCloseScope,
} from '../stateMachine/SyntaxParser.js';
import { destinationGraph } from './destinationGraph.js';
import { eolGraph } from './eolGraph.js';
import { conditionalExpressionGraph } from './expressionGraph.js';

const parseCapture = buildKeywordParser(['capture'], 'Keyword');
const parseEmpty = buildKeywordParser(['empty'], 'Keyword');
const parseAll = buildKeywordParser(['*'], 'Keyword');

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
        .transition('"capture"', parseCapture, skipSeparators, 'message-type')
    .graph.state('message-type')
        .transition('"empty"', parseEmpty, skipSeparators, 'identifier')
        .transition('"*"', parseAll, skipSeparators, 'identifier')
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
statementGraphBuilder
    .graph.start
        .transition('"clear"', buildKeywordParser(['clear'], 'Keyword'), skipSeparators, 'end')
        .transition('"append", "prepend"', buildKeywordParser(['append', 'prepend'], 'Keyword'), skipSeparators, 'route')
        .transition('"if", "elseif", "while"', buildKeywordParser(['if', 'elseif', 'while'], 'Keyword'), skipSeparators, 'conditional')
        .transition('"else"', buildKeywordParser(['else'], 'Keyword'), skipSeparators, 'else')
        .transition('"for"', buildKeywordParser(['for'], 'Keyword'), skipSeparators, 'for')
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

export const routingStatementGraph = statementGraphBuilder.build();
