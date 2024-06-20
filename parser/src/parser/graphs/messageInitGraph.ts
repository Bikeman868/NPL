import { closeCurlyBracket, openCurlyBracket } from '#interfaces/charsets.js';
import { GraphBuilder } from '../stateMachine/GraphBuilder.js';
import { skipSeparators, parseIdentifier, parseOpenScope, parseCloseScope } from '../stateMachine/SyntaxParser.js';
import { eolGraph, expressionGraph } from './index.js';

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
        .transition('field name', parseIdentifier, skipSeparators, 'single-value')
        .transition(openCurlyBracket, parseOpenScope, skipSeparators, 'fields')
    .graph.state('single-value')
        .subGraph('single-value', expressionGraph)
    .graph.state('fields')
        .transition(closeCurlyBracket, parseCloseScope, skipSeparators, 'end')
        .subGraph('blank-line', eolGraph, 'fields')
        .transition('field name', parseIdentifier, skipSeparators, 'value')
    .graph.state('value')
        .subGraph('value', expressionGraph, 'fields')
    .graph.state('end')
        .subGraph('end', eolGraph)
    .graph.build();
}