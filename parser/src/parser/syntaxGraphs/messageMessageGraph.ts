import { GraphBuilder } from '../stateMachine/GraphBuilder.js';
import { skipSeparators, parseOpenScope, parseCloseScope, parseIdentifier } from '../stateMachine/SyntaxParser.js';
import { eolGraph, assignmentExpressionGraph, parseMessageKeyword } from '../index.js';

// prettier-ignore
/* Examples

    message fieldName fieldValue<EOL>

    message {
        stringField 'String value'
        numberField 123.4
        mapField {
            'key1' 'value1'
            'key2' 'value2'
        }
        messageField MessageType {
            message oneField oneFieldValue
        }
    }<EOL>

*/
export function defineMessageMessageGraph(builder: GraphBuilder) {
    builder.clear()
    .graph.start
        .transition(parseMessageKeyword, skipSeparators, 'definition')
    .graph.state('definition')
        .transition(parseOpenScope, skipSeparators, 'fields')
        .transition(parseIdentifier, skipSeparators, 'single-field')
    .graph.state('fields')
        .transition(parseCloseScope, skipSeparators, 'end')
        .transition(parseIdentifier, skipSeparators, 'field-value')
        .subGraph('blank-line', eolGraph, 'fields')
    .graph.state('single-field')
        .subGraph('single-expression', assignmentExpressionGraph)
    .graph.state('field-value')
        .subGraph('expression', assignmentExpressionGraph, 'fields')
    .graph.state('end')
        .subGraph('end', eolGraph)
    .graph.build();
}
