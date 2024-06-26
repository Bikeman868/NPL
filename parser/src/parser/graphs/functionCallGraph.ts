import { comma } from '#interfaces/charsets.js';
import { GraphBuilder } from '../stateMachine/GraphBuilder.js';
import { buildSymbolParser, skipSeparators } from '../stateMachine/SyntaxParser.js';
import {
    binaryOperatorGraph,
    expressionTermGraph,
    functionCallGraph,
    indexExpressionGraph,
    parseEndFunctionCallSymbol,
    parseStartFunctionCallSymbol,
} from '../index.js';

// prettier-ignore
/* Examples

    (1, 2, 3)

    (list[3], myString.indexOf(' '), 99)

*/
export function defineFunctionCallGraph(builder: GraphBuilder) {
    builder.clear()
    .graph.start
        .transition(parseStartFunctionCallSymbol, skipSeparators, 'parameter')
    .graph.state('parameter')
        .transition(parseEndFunctionCallSymbol, skipSeparators)
        .subGraph('term', expressionTermGraph, 'operator')
    .graph.state('operator')
        .transition(parseEndFunctionCallSymbol, skipSeparators)
        .transition(buildSymbolParser(comma, 'ListSeparator'), skipSeparators, 'parameter')
        .subGraph('operator', binaryOperatorGraph, 'parameter')
        .subGraph('indexer', indexExpressionGraph, 'operator')
        .subGraph('function-call', functionCallGraph, 'operator')
    .graph.build();
}
