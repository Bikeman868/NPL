import { closeCurlyBracket, openCurlyBracket } from '#interfaces/charsets.js';
import {
    buildKeywordParser,
    parseOpenScope,
    skipSeparators,
    parseQualifiedIdentifier,
    parseIdentifier,
    parseCloseScope,
} from '../stateMachine/SyntaxParser.js';
import { eolGraph } from './eolGraph.js';
import { 
    applicationConnectionGraphBuilder,
    parseIngressKeyword,
    parseEgressKeyword,
    configGraph,
} from './index.js';

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
applicationConnectionGraphBuilder
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
        .transition('ingress', parseIngressKeyword, skipSeparators, 'ingress')
        .transition('egress', parseEgressKeyword, skipSeparators, 'egress')
        .subGraph('config', configGraph, 'statements')
    .graph.state('ingress')
        .transition('egress', parseEgressKeyword, skipSeparators, 'ingress-egress')
        .transition('network name', parseQualifiedIdentifier, skipSeparators, 'statements')
    .graph.state('egress')
        .transition('ingress', parseIngressKeyword, skipSeparators, 'ingress-egress')
        .transition('network name', parseQualifiedIdentifier, skipSeparators, 'statements')
    .graph.state('ingress-egress')
        .transition('network name', parseQualifiedIdentifier, skipSeparators, 'statements')
    .graph.state('end')
        .subGraph('end', eolGraph)
    .graph.build();
