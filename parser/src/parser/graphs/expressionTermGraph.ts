import { GraphBuilder } from '../stateMachine/GraphBuilder.js';
import {
    parseBoolean,
    parseNumber,
    parseQualifiedIdentifier,
    parseString,
    skipSeparators,
} from '../stateMachine/SyntaxParser.js';
import {
    literalListGraph,
    literalListGraphBuilder,
    literalMapGraph,
    literalMapGraphBuilder,
    subExpressionGraph,
    subExpressionGraphBuilder,
    unaryOperatorGraph,
    unaryOperatorGraphBuilder,
} from '../index.js';

// prettier-ignore
/* Examples:

    'hello, world'

    [
        1 
        2 
        3
    ]

    namespace1.LogOption.debug

    !namespace1.LogOption.debug

    true

    (<expression>)

    {
        key1 value1
        key2 value2
    }

    Date.now()

    aMessage.field[i + 1]

*/
export function defineExpressionTermGraph(builder: GraphBuilder) {
    builder.clear()
    .graph.start
        .transition(parseString, skipSeparators)
        .transition(parseNumber, skipSeparators)
        .transition(parseBoolean, skipSeparators)
        .transition(parseString, skipSeparators)
        .transition(parseQualifiedIdentifier, skipSeparators)
        .subGraph('literal-list', literalListGraph)
        .subGraph('literal-map', literalMapGraph)
        .subGraph('sub-expression', subExpressionGraph)
        .subGraph('unary', unaryOperatorGraph, 'unary')
    .graph.state('unary')
        .transition(parseString, skipSeparators)
        .transition(parseNumber, skipSeparators)
        .transition(parseBoolean, skipSeparators)
        .transition(parseString, skipSeparators)
        .transition(parseQualifiedIdentifier, skipSeparators)
        .subGraph('unary-literal-list', literalListGraphBuilder.build())
        .subGraph('unary-literal-map', literalMapGraphBuilder.build())
        .subGraph('unary-sub-expression', subExpressionGraphBuilder.build())
        .subGraph('double-unary', unaryOperatorGraphBuilder.build(), 'unary')
    .graph.build();
}
