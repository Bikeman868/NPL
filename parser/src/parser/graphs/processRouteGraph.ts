import { openCurlyBracket, closeCurlyBracket } from '#interfaces/charsets.js';
import { GraphBuilder } from '../stateMachine/GraphBuilder.js';
import {
    buildKeywordParser,
    skipSeparators,
    parseQualifiedIdentifier,
    parseOpenScope,
    parseCloseScope,
} from '../stateMachine/SyntaxParser.js';
import { routingStatementGraph } from './routingStatementGraph.js';
import { eolGraph } from './eolGraph.js';

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
export const processRouteGraph = new GraphBuilder('process-route')
    .graph.start
        .transition('"route"', parseRoute, skipSeparators, 'identifier')
    .graph.state('identifier')
        .transition('message identifier', parseQualifiedIdentifier, skipSeparators, 'definition')
    .graph.state('definition')
        .transition(openCurlyBracket, parseOpenScope, skipSeparators, 'statements')
        .subGraph('single-statement', routingStatementGraph)
        .subGraph('empty-definition', eolGraph)
    .graph.state('statements')
        .transition(closeCurlyBracket, parseCloseScope, skipSeparators, 'end')
        .subGraph('blank-line', eolGraph, 'statements')
        .subGraph('statement', routingStatementGraph, 'statements')
    .graph.state('end')
        .subGraph('end', eolGraph)
    .graph.build();
