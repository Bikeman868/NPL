import { GraphBuilder } from '../stateMachine/GraphBuilder.js';
import { skipSeparators } from '../stateMachine/SyntaxParser.js';
import {
    binaryOperatorGraph,
    expressionTermGraph,
    functionCallGraph,
    indexExpressionGraph,
    parseEndIndexerSymbol,
    parseStartIndexerSymbol,
} from '../index.js';

// prettier-ignore
/* Examples

    [21]

    [i + 1]

    [list[3]]

    [Date.now().year]

*/
export function defineIndexExpressionGraph(builder: GraphBuilder) {
    builder.clear()
    .graph.start
        .transition(parseStartIndexerSymbol, skipSeparators, 'index-expression')
    .graph.state('index-expression')
        .subGraph('term', expressionTermGraph, 'operator')
    .graph.state('operator')
        .transition(parseEndIndexerSymbol, skipSeparators)
        .subGraph('operator', binaryOperatorGraph, 'index-expression')
        .subGraph('indexer', indexExpressionGraph, 'operator')
        .subGraph('function-call', functionCallGraph, 'operator')
    .graph.build();
}
