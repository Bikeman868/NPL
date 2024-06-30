import { GraphBuilder } from '../stateMachine/GraphBuilder.js';
import { skipSeparators, parseIdentifier, parseOpenScope, parseCloseScope } from '../stateMachine/SyntaxParser.js';
import { eolGraph, assignmentExpressionGraph } from '../index.js';

/* Examples

    fieldName expression<EOL>

    {
        fieldName expression
        fieldName expression
    }<EOL>
*/

// prettier-ignore
export function defineMessageInitGraph(builder: GraphBuilder) {
    builder.clear()
    .graph.start
        .transition(parseIdentifier, skipSeparators, 'single-value')
        .transition(parseOpenScope, skipSeparators, 'fields')
    .graph.state('single-value')
        .subGraph('single-value', assignmentExpressionGraph)
    .graph.state('fields')
        .transition(parseCloseScope, skipSeparators, 'end')
        .subGraph('blank-line', eolGraph, 'fields')
        .transition(parseIdentifier, skipSeparators, 'value')
    .graph.state('value')
        .subGraph('value', assignmentExpressionGraph, 'fields')
    .graph.state('end')
        .subGraph('end', eolGraph)
    .graph.build();
}
