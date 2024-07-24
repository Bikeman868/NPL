import { GraphBuilder } from '../stateMachine/GraphBuilder.js';
import {
    buildKeywordParser,
    skipSeparators,
    parseQualifiedIdentifier,
    parseOpenScope,
    parseCloseScope,
} from '../stateMachine/SyntaxParser.js';
import { eolGraph, routingStatementGraph } from '../index.js';

/** Examples

    route message1 { 
        clear
        append process process1
    }<EOL>

    route message1 clear<EOL>

    route message1<EOL>

    route message1 {}<EOL>

    route message1 {
    }<EOL>

 */

const parseRoute = buildKeywordParser(['route'], 'Keyword');

// prettier-ignore
export function defineProcessRouteGraph(builder: GraphBuilder) {
    builder.clear()
    .graph.start
        .transition(parseRoute, skipSeparators, 'identifier')
    .graph.state('identifier')
        .transition(parseQualifiedIdentifier, skipSeparators, 'definition')
    .graph.state('definition')
        .transition(parseOpenScope, skipSeparators, 'statements')
        .subGraph('single-statement', routingStatementGraph)
        .subGraph('empty-definition', eolGraph)
    .graph.state('statements')
        .transition(parseCloseScope, skipSeparators, 'end')
        .subGraph('blank-line', eolGraph, 'statements')
        .subGraph('statement', routingStatementGraph, 'statements')
    .graph.state('end')
        .subGraph('end', eolGraph)
    .graph.build();
}
