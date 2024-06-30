import { GraphBuilder } from '../stateMachine/GraphBuilder.js';
import { skipSeparators } from '../stateMachine/SyntaxParser.js';
import {
    binaryOperatorGraph,
    expressionTermGraph,
    functionCallGraph,
    indexExpressionGraph,
    parseEndSubExpressionSymbol,
    parseStartSubExpressionSymbol,
} from '../index.js';

// prettier-ignore
/* Examples 

    ('hello' + ', ' + 'world')

    (myArray[10])

*/
export function defineSubExpressionGraph(builder: GraphBuilder) {
    builder.clear()
    .graph.start
        .transition(parseStartSubExpressionSymbol, skipSeparators, 'term')
    .graph.state('term')
        .transition(parseEndSubExpressionSymbol, skipSeparators)
        .subGraph('term', expressionTermGraph, 'operator')
    .graph.state('operator')
        .transition(parseEndSubExpressionSymbol, skipSeparators)
        .subGraph('operator', binaryOperatorGraph, 'second-term')
        .subGraph('indexer', indexExpressionGraph, 'operator')
        .subGraph('function-call', functionCallGraph, 'operator')
    .graph.state('second-term')
        .subGraph('second-term', expressionTermGraph, 'operator')
    .graph.build();
}
