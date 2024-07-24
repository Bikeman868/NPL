import { GraphBuilder } from '../stateMachine/GraphBuilder.js';
import {
    binaryOperatorGraph,
    eolGraph,
    expressionTermGraph,
    functionCallGraph,
    indexExpressionGraph,
    literalMapGraph,
    literalMessageGraph,
} from '../index.js';

// prettier-ignore
/* Examples

    'String literal'<EOL>

    123.56<EOL>

    (1 + 2) * (5 + 6)<EOL>

    myArray[10]<EOL>

    ['one'
     'two'
     'three'
    ][index]<EOL>

    myMessage { 
        message id 1
    }<EOL>

    MessageType {
        message {
            field1 field1Value
            field2 field2Value
        }
    }<EOL>

    {
        'key1' 'value1'
        'key2' 'value2'
    }<EOL>

    Date.now()<EOL>

*/
export function defineAssignmentExpressionGraph(builder: GraphBuilder) {
    builder.clear()
    .graph.start
        .subGraph('message-literal', literalMessageGraph, 'end')
        .subGraph('term', expressionTermGraph, 'operator')
    .graph.state('operator')
        .subGraph('end', eolGraph)
        .subGraph('operator', binaryOperatorGraph, 'second-term')
        .subGraph('indexer', indexExpressionGraph, 'operator')
        .subGraph('function-call', functionCallGraph, 'operator')
        .subGraph('map-literal', literalMapGraph, 'operator')
    .graph.state('second-term')
        .subGraph('second-term', expressionTermGraph, 'operator')
    .graph.state('end')
        .subGraph('literal-end', eolGraph)
    .graph.build();
}
