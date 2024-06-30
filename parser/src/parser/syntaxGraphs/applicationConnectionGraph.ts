import { GraphBuilder } from '#parser/stateMachine/GraphBuilder.js';
import {
    parseOpenScope,
    skipSeparators,
    parseQualifiedIdentifier,
    parseIdentifier,
    parseCloseScope,
} from '../stateMachine/SyntaxParser.js';
import { parseIngressKeyword, parseEgressKeyword, configGraph, eolGraph, parseConnectionKeyword } from '../index.js';

// prettier-ignore
/* Examples

    connection npl.io.Emitter emitter {
        ingress network1.input
        egress network1.output
    }<EOL>

    connection npl.io.Emitter emitter {
        ingress egress network1.input
    }<EOL>

*/
export function defineApplicationConnectionGraph(builder: GraphBuilder) {
    builder.clear()
    .graph.start
        .transition(parseConnectionKeyword, skipSeparators, 'type')
    .graph.state('type')
        .transition(parseQualifiedIdentifier, skipSeparators, 'name')
    .graph.state('name')
        .transition(parseIdentifier, skipSeparators, 'definition')
    .graph.state('definition')
        .transition(parseOpenScope, skipSeparators, 'statements')
        .subGraph('empty-definition', eolGraph)
    .graph.state('statements')
        .transition(parseCloseScope, skipSeparators, 'end')
        .subGraph('blank-line', eolGraph, 'statements')
        .transition(parseIngressKeyword, skipSeparators, 'ingress')
        .transition(parseEgressKeyword, skipSeparators, 'egress')
        .subGraph('config', configGraph, 'statements')
    .graph.state('ingress')
        .transition(parseEgressKeyword, skipSeparators, 'ingress-egress')
        .transition(parseQualifiedIdentifier, skipSeparators, 'statements')
    .graph.state('egress')
        .transition(parseIngressKeyword, skipSeparators, 'ingress-egress')
        .transition(parseQualifiedIdentifier, skipSeparators, 'statements')
    .graph.state('ingress-egress')
        .transition(parseQualifiedIdentifier, skipSeparators, 'statements')
    .graph.state('end')
        .subGraph('end', eolGraph)
    .graph.build();
}
