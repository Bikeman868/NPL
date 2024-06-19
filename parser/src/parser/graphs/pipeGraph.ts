import { closeCurlyBracket, openCurlyBracket } from '#interfaces/charsets.js';
import { Graph } from '../stateMachine/Graph.js';
import { GraphBuilder } from '../stateMachine/GraphBuilder.js';
import {
    buildKeywordParser,
    parseIdentifier,
    skipSeparators,
    parseOpenScope,
    parseCloseScope,
} from '../stateMachine/SyntaxParser.js';
import { eolGraph } from './eolGraph.js';
import { pipeRouteGraph } from './pipeRouteGraph.js';

/* Examples

    pipe myPipe<EOL>

    pipe myPipe {}<EOL>

    pipe myPipe {
        route * {
            clear
        }
    }<EOL>

*/

const parsePipe = buildKeywordParser(['pipe'], 'Keyword');

// prettier-ignore
export const pipeGraph: Graph = new GraphBuilder('pipe')
    .graph.start
        .transition('"pipe"', parsePipe, skipSeparators, 'name')
    .graph.state('name')
        .transition('pipe name', parseIdentifier, skipSeparators, 'definition')
    .graph.state('definition')
        .transition(openCurlyBracket, parseOpenScope, skipSeparators, 'statements')
        .subGraph('empty-definition', eolGraph)
    .graph.state('statements')
        .transition(closeCurlyBracket, parseCloseScope, skipSeparators, 'end')
        .subGraph('blank-line', eolGraph, 'statements')
        .subGraph('route', pipeRouteGraph, 'statements')
    .graph.state('end')
        .subGraph('end', eolGraph)
    .graph.build();
