import { GraphBuilder } from '../stateMachine/GraphBuilder.js';
import { parseBoolean, parseDate, parseIdentifier, parseNumber, parseQualifiedIdentifier, parseString, skipSeparators } from '../stateMachine/SyntaxParser.js';
import {
    assignmentExpressionGraph,
    eolGraph,
    parseEndMapLiteralSymbol,
    parseSpreadOperatorSymbol,
    parseStartMapLiteralSymbol,
    subExpressionGraph,
} from '../index.js';

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
        (prefix + id) newValue3
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
        .transition(parseString, skipSeparators, 'value')
        .transition(parseNumber, skipSeparators, 'value')
        .transition(parseBoolean, skipSeparators, 'value')
        .transition(parseDate, skipSeparators, 'value')
        .subGraph('blank-line', eolGraph, 'entries')
        .subGraph('sub-expression', subExpressionGraph, 'value')
    .graph.state('value')
        .subGraph('value', assignmentExpressionGraph, 'entries')
    .graph.state('spread-operator')
        .transition(parseQualifiedIdentifier, skipSeparators, 'entries')
    .graph.build();
}
