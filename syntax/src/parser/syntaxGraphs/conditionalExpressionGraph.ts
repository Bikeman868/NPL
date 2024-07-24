import { GraphBuilder } from '../stateMachine/GraphBuilder.js';
import { parseOpenScope, skipSeparators } from '../stateMachine/SyntaxParser.js';
import { binaryOperatorGraph, expressionTermGraph, functionCallGraph, indexExpressionGraph } from '../index.js';

// prettier-ignore
/* Examples

    'String literal' {

    123.56 {

    (1 + 2) * (5 + 6) {

*/
export function defineConditionalExpressionGraph(builder: GraphBuilder) {
    builder.clear()
    .graph.start
        .subGraph('term', expressionTermGraph, 'operator')
    .graph.state('operator')
        .transition(parseOpenScope, skipSeparators)
        .subGraph('operator', binaryOperatorGraph, 'second-term')
        .subGraph('indexer', indexExpressionGraph, 'operator')
        .subGraph('function-call', functionCallGraph, 'operator')
    .graph.state('second-term')
        .subGraph('second-term', expressionTermGraph, 'operator')
    .graph.build();
}
