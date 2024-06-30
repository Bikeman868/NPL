import { GraphBuilder } from '#parser/stateMachine/GraphBuilder.js';
import { parseIdentifier, skipSeparators } from '../stateMachine/SyntaxParser.js';
import { assignmentExpressionGraph, literalMessageGraph, parseConstKeyword } from '../index.js';

// prettier-ignore
/* Examples

    const name 'String value'<EOL>

    const daySeconds 60 * 60 * 24<EOL>

    const myMessage = MyMessage {
        message fieldName 'string value'
    }

*/
export function defineConstGraph(builder: GraphBuilder) {
    builder.clear()
    .graph.start
        .transition(parseConstKeyword, skipSeparators, 'name')
    .graph.state('name')
        .transition(parseIdentifier, skipSeparators, 'value')
    .graph.state('value')
        .subGraph('message-literal', literalMessageGraph)
        .subGraph('const-value', assignmentExpressionGraph)
    .graph.build();
}
