import { closeCurlyBracket, openCurlyBracket } from '#interfaces/charsets.js';
import { Graph } from '../stateMachine/Graph.js';
import { GraphBuilder } from '../stateMachine/GraphBuilder.js';
import {
    buildKeywordParser,
    parseOpenScope,
    skipSeparators,
    parseQualifiedIdentifier,
    parseIdentifier,
    parseCloseScope,
} from '../stateMachine/SyntaxParser.js';
import { configGraph } from './configGraph.js';
import { eolGraph } from './eolGraph.js';

/* Examples

    connection npl.io.Emitter emitter {
        ingress network1.input
        egress network1.output
    }<EOL>

    connection npl.io.Emitter emitter {
        ingress egress network1.input
    }<EOL>

*/

const parseIngress = buildKeywordParser(['ingress'], 'Keyword');
const parseEgress = buildKeywordParser(['egress'], 'Keyword');

// prettier-ignore
export const applicationConnectionGraph: Graph = new GraphBuilder('connection')
    .graph.start
        .transition('"connection"', buildKeywordParser(['connection'], 'Keyword'), skipSeparators, 'type')
    .graph.state('type')
        .transition('connection type', parseQualifiedIdentifier, skipSeparators, 'name')
    .graph.state('name')
        .transition('connection name', parseIdentifier, skipSeparators, 'definition')
    .graph.state('definition')
        .transition(openCurlyBracket, parseOpenScope, skipSeparators, 'statements')
        .subGraph('empty-definition', eolGraph)
    .graph.state('statements')
        .transition(closeCurlyBracket, parseCloseScope, skipSeparators, 'end')
        .subGraph('blank-line', eolGraph, 'statements')
        .transition('ingress', parseIngress, skipSeparators, 'ingress')
        .transition('egress', parseEgress, skipSeparators, 'egress')
        .subGraph('config', configGraph, 'statements')
    .graph.state('ingress')
        .transition('egress', parseEgress, skipSeparators, 'ingress-egress')
        .transition('network name', parseQualifiedIdentifier, skipSeparators, 'statements')
    .graph.state('egress')
        .transition('ingress', parseIngress, skipSeparators, 'ingress-egress')
        .transition('network name', parseQualifiedIdentifier, skipSeparators, 'statements')
    .graph.state('ingress-egress')
        .transition('network name', parseQualifiedIdentifier, skipSeparators, 'statements')
    .graph.state('end')
        .subGraph('end', eolGraph)
    .graph.build();
