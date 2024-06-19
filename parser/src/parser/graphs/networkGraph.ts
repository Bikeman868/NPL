import { closeCurlyBracket, openCurlyBracket } from '#interfaces/charsets.js';
import { Graph } from '../stateMachine/Graph.js';
import { GraphBuilder } from '../stateMachine/GraphBuilder.js';
import {
    buildKeywordParser,
    skipSeparators,
    parseOpenScope,
    parseIdentifier,
    parseCloseScope,
} from '../stateMachine/SyntaxParser.js';
import { processGraph } from './processGraph.js';
import { pipeGraph } from './pipeGraph.js';
import { destinationListGraph } from './destinationListGraph.js';
import { configGraph } from './configGraph.js';
import { eolGraph } from './eolGraph.js';

/* Examples

    network network1 egress ingress entrypoint1 network network2.entrypoint1<EOL>

    network network1 egress ingress default { process process1 }<EOL>

    network network1 {
        ingress default process process1
        egress default process process1
        ingress namedEntrypoint process process2
        egress namedEntrypoint process process2
    }<EOL>

    network network1 {
        egress entrypoint1 {
            process process1
        }
        ingress entrypoint1 {
            pipe pipe1
            network network2
        }
        config {
        }
        process process1 {
        }
        pipe pipe1 {
        }
    }<EOL>
    
*/

const parseNetwork = buildKeywordParser(['network'], 'Keyword');
const parseIngress = buildKeywordParser(['ingress'], 'Keyword');
const parseEgress = buildKeywordParser(['egress'], 'Keyword');
const parseDefault = buildKeywordParser(['default'], 'Keyword');

// prettier-ignore
const entrypointGraph: Graph = new GraphBuilder('network-entry')
    .start
        .transition('ingress', parseIngress, skipSeparators, 'ingress')
        .transition('egress', parseEgress, skipSeparators, 'egress')
    .graph.state('ingress')
        .transition('egress', parseEgress, skipSeparators, 'name')
        .transition('default', parseDefault, skipSeparators)
        .transition('entry point name', parseIdentifier, skipSeparators)
    .graph.state('egress')
        .transition('ingress', parseIngress, skipSeparators, 'name')
        .transition('default', parseDefault, skipSeparators)
        .transition('entry point name', parseIdentifier, skipSeparators)
    .graph.state('name')
        .transition('default', parseDefault, skipSeparators)
        .transition('entry point name', parseIdentifier, skipSeparators)
    .graph.build();

// prettier-ignore
export const networkGraph: Graph = new GraphBuilder('network')
    .graph.start
        .transition('"network"', parseNetwork, skipSeparators, 'name')
    .graph.state('name')
        .transition('network name', parseIdentifier, skipSeparators, 'definition')
    .graph.state('definition')
        .transition(openCurlyBracket, parseOpenScope, skipSeparators, 'statement-block')
        .subGraph('empty-definition', eolGraph)
        .subGraph('single-line', entrypointGraph, 'single-entrypoint')
    .graph.state('single-entrypoint')
        .subGraph('destination-list', destinationListGraph, 'end')
    .graph.state('statement-block')
        .transition(closeCurlyBracket, parseCloseScope, skipSeparators, 'end')
        .subGraph('blank-statement-line', eolGraph, 'statement-block')
        .subGraph('network-entrypoint', entrypointGraph, 'entrypoint-statement')
        .subGraph('process', processGraph, 'statement-block')
        .subGraph('pipe', pipeGraph, 'statement-block')
        .subGraph('config', configGraph, 'statement-block')
    .graph.state('entrypoint-statement')
        .subGraph('entrypoint-statement', destinationListGraph, 'statement-block')
    .graph.state('end')
        .subGraph('end', eolGraph)
    .graph.build();
