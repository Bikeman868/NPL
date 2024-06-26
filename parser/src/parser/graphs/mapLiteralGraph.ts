// prettier-ignore

import { GraphBuilder } from '../stateMachine/GraphBuilder.js';
import { parseIdentifier, skipSeparators } from '../stateMachine/SyntaxParser.js';
import { assignmentExpressionGraph, eolGraph, parseEndMapLiteralSymbol, parseStartMapLiteralSymbol } from '../index.js';

// prettier-ignore
/* Examples

    { 
        'key1' value1
        'key2' 123 + 456
    }<EOL>

*/
export function defineMapLiteralGraph(builder: GraphBuilder) {
    builder.clear()
    .graph.start
        .transition(parseStartMapLiteralSymbol, skipSeparators, 'entries')
    .graph.state('entries')
        .transition(parseEndMapLiteralSymbol, skipSeparators, 'end')
        .transition(parseIdentifier, skipSeparators, 'value')
        .subGraph('blank-line', eolGraph, 'entries')
    .graph.state('value')
        .subGraph('value', assignmentExpressionGraph, 'entries')
    .graph.state('end')
        .subGraph('end', eolGraph)
    .graph.build();
}
