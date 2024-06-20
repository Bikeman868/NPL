import { GraphBuilder } from '../stateMachine/GraphBuilder.js';
import { buildKeywordParser, parseIdentifier, skipSeparators } from '../stateMachine/SyntaxParser.js';
import { eolGraph, expressionGraph, messageLiteralGraph, parseVarKeyword } from './index.js';

// prettier-ignore
/* Examples

    var name 'String value'<EOL>

    var nextId message.id + 1<EOL>

*/
export function defineVarGraph(builder: GraphBuilder) {
    builder.clear()
    .graph.start
        .transition('"var"', parseVarKeyword, skipSeparators, 'name')
    .graph.state('name')
        .transition('var name', parseIdentifier, skipSeparators, 'value')
    .graph.state('value')
        .subGraph('no-value', eolGraph)
        .subGraph('message-literal', messageLiteralGraph)
        .subGraph('initial value expression', expressionGraph)
    .graph.build();
}