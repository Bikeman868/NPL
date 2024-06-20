import { GraphBuilder } from '../stateMachine/GraphBuilder.js';
import { parseQualifiedIdentifier, skipSeparators } from '../stateMachine/SyntaxParser.js';
import { assignmentExpressionGraph, parseSetKeyword } from './index.js';

// prettier-ignore
/* Examples

    set name 'String value'<EOL>

    set nextId message.id + 1<EOL>

*/
export function defineSetGraph(builder: GraphBuilder) {
    builder.clear()
    .graph.start
        .transition('"set"', parseSetKeyword, skipSeparators, 'name')
    .graph.state('name')
        .transition('const name', parseQualifiedIdentifier, skipSeparators, 'value')
    .graph.state('value')
        .subGraph('expression', assignmentExpressionGraph)
    .graph.build();
}
