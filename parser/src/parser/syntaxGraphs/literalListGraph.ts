import { GraphBuilder } from '../stateMachine/GraphBuilder.js';
import { skipSeparators } from '../stateMachine/SyntaxParser.js';
import {
    assignmentExpressionGraph,
    eolGraph,
    parseEndListLiteralSymbol,
    parseEndMapLiteralSymbol,
    parseStartListLiteralSymbol,
    parseStartMapLiteralSymbol,
} from '../index.js';

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
        .transition(parseStartListLiteralSymbol, skipSeparators, 'elements')
    .graph.state('elements')
        .transition(parseEndListLiteralSymbol, skipSeparators)
        .subGraph('list-blank-line', eolGraph, 'elements')
        .subGraph('list-element', assignmentExpressionGraph, 'elements')
    .graph.build();
}
