import { GraphBuilder } from '../stateMachine/GraphBuilder.js';
import { skipSeparators } from '../stateMachine/SyntaxParser.js';
import { assignmentExpressionGraph, eolGraph, parseEndMapLiteralSymbol, parseStartMapLiteralSymbol } from '../index.js';

// prettier-ignore
/* Examples 

    [ 'hello'
      'world'
    ]

    []

*/
export function defineLiteralListGraph(builder: GraphBuilder) {
    builder.clear()
    .graph.start
        .transition(parseStartMapLiteralSymbol, skipSeparators, 'elements')
    .graph.state('elements')
        .transition(parseEndMapLiteralSymbol, skipSeparators)
        .subGraph('list-blank-line', eolGraph, 'elements')
        .subGraph('list-element', assignmentExpressionGraph, 'elements')
    .graph.build();
}
