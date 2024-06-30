import { GraphBuilder } from '../stateMachine/GraphBuilder.js';
import {
    buildKeywordParser,
    skipSeparators,
    parseOpenScope,
    parseIdentifier,
    parseCloseScope,
} from '../stateMachine/SyntaxParser.js';
import { configGraph, constGraph, destinationListGraph, eolGraph, pipeGraph, processGraph } from '../index.js';

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
const entrypointGraph = new GraphBuilder('network-entry')
    .start
        .transition(parseIngress, skipSeparators, 'ingress')
        .transition(parseEgress, skipSeparators, 'egress')
    .graph.state('ingress')
        .transition(parseEgress, skipSeparators, 'name')
        .transition(parseDefault, skipSeparators)
        .transition(parseIdentifier, skipSeparators)
    .graph.state('egress')
        .transition(parseIngress, skipSeparators, 'name')
        .transition(parseDefault, skipSeparators)
        .transition(parseIdentifier, skipSeparators)
    .graph.state('name')
        .transition(parseDefault, skipSeparators)
        .transition(parseIdentifier, skipSeparators)
    .graph.build();

// prettier-ignore
export function defineNetworkGraph(builder: GraphBuilder) {
    builder.clear()
    .graph.start
        .transition(parseNetwork, skipSeparators, 'name')
    .graph.state('name')
        .transition(parseIdentifier, skipSeparators, 'definition')
    .graph.state('definition')
        .transition(parseOpenScope, skipSeparators, 'statement-block')
        .subGraph('empty-definition', eolGraph)
        .subGraph('single-line', entrypointGraph, 'single-entrypoint')
    .graph.state('single-entrypoint')
        .subGraph('destination-list', destinationListGraph, 'end')
    .graph.state('statement-block')
        .transition(parseCloseScope, skipSeparators, 'end')
        .subGraph('blank-statement-line', eolGraph, 'statement-block')
        .subGraph('network-entrypoint', entrypointGraph, 'entrypoint-statement')
        .subGraph('process', processGraph, 'statement-block')
        .subGraph('pipe', pipeGraph, 'statement-block')
        .subGraph('config', configGraph, 'statement-block')
        .subGraph('const', constGraph, 'statement-block')
    .graph.state('entrypoint-statement')
        .subGraph('entrypoint-statement', destinationListGraph, 'statement-block')
    .graph.state('end')
        .subGraph('end', eolGraph)
    .graph.build();
}
