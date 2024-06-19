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
import { configGraph } from './configGraph.js';
import { applicationConnectionGraph } from './applicationConnectionGraph.js';
import { eolGraph } from './eolGraph.js';

/* Examples

    application app

    application app {
        config {
            timeout 10
        }
        connection npl.io.Emitter emitter {
            config count 1
        }
    }<EOL>

*/

// prettier-ignore
export const applicationGraph: Graph = new GraphBuilder('application')
    .graph.start
        .transition('"application"', buildKeywordParser(['application'], 'Keyword'), skipSeparators, 'name')
    .graph.state('name')
        .transition('application name', parseIdentifier, skipSeparators, 'definition')
    .graph.state('definition')
        .transition(openCurlyBracket, parseOpenScope, skipSeparators, 'statements')
        .subGraph('empty-definition', eolGraph)
    .graph.state('statements')
        .transition(closeCurlyBracket, parseCloseScope, skipSeparators, 'end')
        .subGraph('blank-line', eolGraph, 'statements')
        .subGraph('config', configGraph, 'statements')
        .subGraph('connection', applicationConnectionGraph, 'statements')
    .graph.state('end')
        .subGraph('end', eolGraph)
    .graph.build();
