import { closeCurlyBracket, openCurlyBracket } from '#interfaces/charsets.js';
import { Graph } from '../stateMachine/Graph.js';
import { GraphBuilder } from '../stateMachine/GraphBuilder.js';
import {
    buildKeywordParser,
    parseCloseScope,
    skipSeparators,
    parseQualifiedIdentifier,
    parseOpenScope,
} from '../stateMachine/SyntaxParser.js';
import { usingGraph } from './usingGraph.js';
import { messageDefinitionGraph } from './messageDefinitionGraph.js';
import { networkGraph } from './networkGraph.js';
import { enumGraph } from './enumGraph.js';
import { applicationGraph } from './applicationGraph.js';
import { eolGraph } from './eolGraph.js';

const parseNamespace = buildKeywordParser(['namespace'], 'Keyword');

/* Examples

    namespace test<EOL>

    namespace test {
    }<EOL>

    namespace test { // Comment
        // Comment
        application app // Comment
    } // Comment<EOL>

    namespace test message myMessage string theField<EOL>

    namespace test message myMessage {
        string field1
        string field2
    }<EOL>

*/

// prettier-ignore
export const namespaceGraph: Graph = new GraphBuilder('namespace')
    .graph.start
        .transition('"namespace"', parseNamespace, skipSeparators, 'name')
    .graph.state('name')
        .transition('namespace identifier', parseQualifiedIdentifier, skipSeparators, 'definition')
    .graph.state('definition')
        .transition(openCurlyBracket, parseOpenScope, skipSeparators, 'statement')
        .subGraph('empty-definition', eolGraph)
        .subGraph('single-using', usingGraph)
        .subGraph('single-message', messageDefinitionGraph)
        .subGraph('single-network', networkGraph)
        .subGraph('single-enum', enumGraph)
        .subGraph('single-application', applicationGraph)
    .graph.state('statement')
        .transition(closeCurlyBracket, parseCloseScope, skipSeparators, 'end')
        .subGraph('blank-line', eolGraph, 'statement')
        .subGraph('using', usingGraph, 'statement')
        .subGraph('message', messageDefinitionGraph, 'statement')
        .subGraph('network', networkGraph, 'statement')
        .subGraph('enum', enumGraph, 'statement')
        .subGraph('application', applicationGraph, 'statement')
    .graph.state('end')
        .subGraph('end', eolGraph)
    .graph.build();
