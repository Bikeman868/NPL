import { closeCurlyBracket, openCurlyBracket } from '#interfaces/charsets.js';
import { Graph } from '../stateMachine/Graph.js';
import { GraphBuilder } from '../stateMachine/GraphBuilder.js';
import {
    buildKeywordParser,
    skipSeparators,
    parseIdentifier,
    parseOpenScope,
    parseCloseScope,
} from '../stateMachine/SyntaxParser.js';
import { eolGraph } from './eolGraph.js';
import { processAcceptGraph } from './processAcceptGraph.js';
import { testGraph } from './testGraph.js';

const parseProcess = buildKeywordParser(['process'], 'Keyword');

/* Examples

    process process1<EOL>

    process process1 {
        accept empty {
            emit MyMessage {
                message {
                    text 'Hello world'
                }
            }
        }
        test 'It should work' {
            emit empty
            expect MyMessage {
                message {
                    text 'Hello world'
                }
            }
        }
    }<EOL>

*/

// prettier-ignore
export const processGraph: Graph = new GraphBuilder('process')
    .graph.start.
        transition('"process"', parseProcess, skipSeparators, 'name')
    .graph.state('name')
        .transition('process name', parseIdentifier, skipSeparators, 'definition')
    .graph.state('definition')
        .transition(openCurlyBracket, parseOpenScope, skipSeparators, 'statements')
        .subGraph('empty-definition', eolGraph)
    .graph.state('statements')
        .transition(closeCurlyBracket, parseCloseScope, skipSeparators, 'end')
        .subGraph('blank-line', eolGraph, 'statements')
        .subGraph('accept', processAcceptGraph, 'statements')
        .subGraph('test', testGraph, 'statements')
    .graph.state('end')
        .subGraph('end', eolGraph)
    .graph.build();
