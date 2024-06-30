import { GraphBuilder } from '../stateMachine/GraphBuilder.js';
import {
    buildKeywordParser,
    parseCloseScope,
    skipSeparators,
    parseQualifiedIdentifier,
    parseOpenScope,
} from '../stateMachine/SyntaxParser.js';
import { applicationGraph, constGraph, enumGraph, eolGraph, messageDefinitionGraph, networkGraph, usingGraph } from '../index.js';

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
export function defineNamespaceGraph(builder: GraphBuilder) {
    builder.clear()
    .graph.start
        .transition(parseNamespace, skipSeparators, 'name')
    .graph.state('name')
        .transition(parseQualifiedIdentifier, skipSeparators, 'definition')
    .graph.state('definition')
        .transition(parseOpenScope, skipSeparators, 'statement')
        .subGraph('empty-definition', eolGraph)
        .subGraph('single-using', usingGraph)
        .subGraph('single-message', messageDefinitionGraph)
        .subGraph('single-network', networkGraph)
        .subGraph('single-enum', enumGraph)
        .subGraph('single-const', constGraph)
        .subGraph('single-application', applicationGraph)
    .graph.state('statement')
        .transition(parseCloseScope, skipSeparators, 'end')
        .subGraph('blank-line', eolGraph, 'statement')
        .subGraph('using', usingGraph, 'statement')
        .subGraph('message', messageDefinitionGraph, 'statement')
        .subGraph('network', networkGraph, 'statement')
        .subGraph('enum', enumGraph, 'statement')
        .subGraph('const', constGraph, 'statement-block')
        .subGraph('application', applicationGraph, 'statement')
    .graph.state('end')
        .subGraph('end', eolGraph)
    .graph.build();
}
