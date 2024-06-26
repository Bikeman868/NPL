import { GraphBuilder } from '../stateMachine/GraphBuilder.js';
import { parseIdentifier, skipSeparators } from '../stateMachine/SyntaxParser.js';
import { assignmentExpressionGraph, eolGraph, parseEndMapLiteralSymbol, parseStartMapLiteralSymbol } from '../index.js';

// prettier-ignore
/* Examples 

    {
        'key1' 1
        'key2' 2
    }

    {}

*/
export function defineLiteralMapGraph(builder: GraphBuilder) {
    builder.clear()
    .graph.start
        .transition(parseStartMapLiteralSymbol, skipSeparators, 'entries')
    .graph.state('entries')
        .transition(parseEndMapLiteralSymbol, skipSeparators)
        .transition(parseIdentifier, skipSeparators, 'value')
        .subGraph('blank-line', eolGraph, 'entries')
    .graph.state('value')
        .subGraph('value', assignmentExpressionGraph, 'entries')
    .graph.build();
}
