import { GraphBuilder } from '../stateMachine/GraphBuilder.js';
import { parseIdentifier, parseQualifiedIdentifier, skipSeparators } from '../stateMachine/SyntaxParser.js';
import { assignmentExpressionGraph, eolGraph, parseEndMapLiteralSymbol, parseSpreadOperatorSymbol, parseStartMapLiteralSymbol } from '../index.js';

// prettier-ignore
/* Examples 

    {
        'key1' 1
        'key2' 2
    }

    {}

    {
        ...existingMap
        newKey1 newValue1
        newKey2 newValue2
    }

*/
export function defineLiteralMapGraph(builder: GraphBuilder) {
    builder.clear()
    .graph.start
        .transition(parseStartMapLiteralSymbol, skipSeparators, 'entries')
    .graph.state('entries')
        .transition(parseEndMapLiteralSymbol, skipSeparators)
        .transition(parseIdentifier, skipSeparators, 'value')
        .transition(parseSpreadOperatorSymbol, skipSeparators, 'spread-operator')
        .subGraph('blank-line', eolGraph, 'entries')
    .graph.state('value')
        .subGraph('value', assignmentExpressionGraph, 'entries')
    .graph.state('spread-operator')
        .transition(parseQualifiedIdentifier, skipSeparators, 'entries')
    .graph.build();
}
