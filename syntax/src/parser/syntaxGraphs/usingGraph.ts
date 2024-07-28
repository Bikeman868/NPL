import { GraphBuilder } from '../stateMachine/GraphBuilder.js';
import { parseQualifiedIdentifier, skipSeparators, skipWhitespace } from '../stateMachine/SyntaxParser.js';
import { eolGraph, parseUsingKeyword } from '../index.js';

// prettier-ignore
/* Examples

    using namespace1<EOL>

    using namespace1.namespace2<EOL>

*/
export function defineUsingGraph(builder: GraphBuilder) {
    builder.clear()
    .graph.start
        .transition(parseUsingKeyword, skipSeparators, 'namespace')
    .graph.state('namespace')
        .transition(parseQualifiedIdentifier, skipSeparators, 'eol')
    .graph.state('eol')
        .subGraph('eol', eolGraph)
    .graph.build();
}
