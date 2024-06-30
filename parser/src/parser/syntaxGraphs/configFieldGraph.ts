import { GraphBuilder } from '#parser/stateMachine/GraphBuilder.js';
import { skipSeparators, parseIdentifier } from '../stateMachine/SyntaxParser.js';
import { assignmentExpressionGraph } from '../index.js';

// prettier-ignore
/* Examples

    timeout 20<EOL>

*/
export function defineConfigFieldGraph(builder: GraphBuilder) {
    builder.clear()
    .graph.start
        .transition(parseIdentifier, skipSeparators, 'field-value')
    .graph.state('field-value')
        .subGraph('default value', assignmentExpressionGraph)
    .graph.build();
}
