import { GraphBuilder } from '../stateMachine/GraphBuilder.js';
import { parseIdentifier, skipSeparators } from '../stateMachine/SyntaxParser.js';
import { assignmentExpressionGraph, dataTypeGraph, eolGraph, parseVarKeyword } from '../index.js';

// prettier-ignore
/* Examples

    var name 'String value'<EOL>

    var nextId message.id + 1<EOL>

    var name string<EOL>

    var newMap map<string MyMessageType><EOL>

    var myMap {
        "key1" 1
        'key1' 2
    }<EOL>

    var date Date.now()

*/
export function defineVarGraph(builder: GraphBuilder) {
    builder.clear()
    .graph.start
        .transition(parseVarKeyword, skipSeparators, 'name')
    .graph.state('name')
        .transition(parseIdentifier, skipSeparators, 'value')
    .graph.state('value')
        .subGraph('no-value', eolGraph)
        .subGraph('initial value', assignmentExpressionGraph)
    .graph.state('end')
        .subGraph('end', eolGraph)
    .graph.build();
}
