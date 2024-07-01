import { GraphBuilder } from '../stateMachine/GraphBuilder.js';
import { skipSeparators, parseIdentifier, parseOpenScope, parseCloseScope } from '../stateMachine/SyntaxParser.js';
import { dataTypeGraph, eolGraph, parseMessageFieldQualifierKeyword, parseMessageKeyword } from '../index.js';

/* Examples:
    string[] myString

    boolean flag

    new number quantity

    deprecated boolean enabled
*/
// prettier-ignore
const messageFieldGraph = new GraphBuilder('message-field')
    .graph.start
        .transition(parseMessageFieldQualifierKeyword, skipSeparators, 'type')
        .subGraph('type', dataTypeGraph, 'identifier')
    .graph.state('type')
        .subGraph('qualified-type', dataTypeGraph, 'identifier')
    .graph.state('identifier')
        .transition(parseIdentifier, skipSeparators)
    .graph.build();

/* Examples
    message TestMessage<EOL>

    message TestMessage // Comment<EOL>

    message TestMessage string onlyField<EOL>

    message TestMessage {} // Comment<EOL>

    message TestMessage { // Comment
    } // Comment<EOL>

    message TextMessage {
        string field1
        string field2
    } // Comment<EOL>
*/

// prettier-ignore
export function defineMessageDefinitionGraph(builder: GraphBuilder) {
    builder.clear()
    .graph.start
        .transition(parseMessageKeyword, skipSeparators, 'name')
    .graph.state('name')
        .transition(parseIdentifier, skipSeparators, 'definition')
    .graph.state('definition')
        .transition(parseOpenScope, skipSeparators, 'fields')
        .subGraph('empty-definition', eolGraph)
        .subGraph('single-field', messageFieldGraph, 'end')
    .graph.state('fields')
        .transition(parseCloseScope, skipSeparators, 'end')
        .subGraph('blank-line', eolGraph, 'fields')
        .subGraph('field', messageFieldGraph, 'field-end')
    .graph.state('field-end')
        .subGraph('field-end', eolGraph, 'fields')
    .graph.state('end')
        .subGraph('end', eolGraph)
    .graph.build();
}
