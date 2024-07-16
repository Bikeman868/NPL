import { GraphBuilder } from '../stateMachine/GraphBuilder.js';
import { skipSeparators, parseOpenScope, parseCloseScope, parseIdentifier, parseQualifiedIdentifier } from '../stateMachine/SyntaxParser.js';
import { eolGraph, assignmentExpressionGraph, parseMessageKeyword, parseSpreadOperator } from '../index.js';

// prettier-ignore
/* Examples

    message fieldName fieldValue<EOL>

    message ...anotherMessage<EOL>

    message {
        ...anotherMessage
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
        .transition(parseSpreadOperator, skipSeparators, 'single-spread')
    .graph.state('fields')
        .transition(parseCloseScope, skipSeparators, 'end')
        .transition(parseIdentifier, skipSeparators, 'field-value')
        .transition(parseSpreadOperator, skipSeparators, 'spread')
        .subGraph('blank-line', eolGraph, 'fields')
    .graph.state('single-field')
        .subGraph('single-expression', assignmentExpressionGraph)
    .graph.state('single-spread')
        .transition(parseQualifiedIdentifier, skipSeparators, 'end')
    .graph.state('field-value')
        .subGraph('expression', assignmentExpressionGraph, 'fields')
    .graph.state('spread')
        .transition(parseQualifiedIdentifier, skipSeparators, 'fields')
    .graph.state('end')
        .subGraph('end', eolGraph)
    .graph.build();
}
