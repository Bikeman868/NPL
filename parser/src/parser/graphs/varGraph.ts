import { GraphBuilder } from '../stateMachine/GraphBuilder.js';
import { buildKeywordParser, parseIdentifier, skipSeparators } from '../stateMachine/SyntaxParser.js';
import { eolGraph } from './eolGraph.js';
import { expressionGraph } from './expressionGraph.js';
import { messageLiteralGraph } from './messageLiteralGraph.js';

/* Examples

    var name 'String value'<EOL>

    var nextId message.id + 1<EOL>

*/

// prettier-ignore
export const varGraph = new GraphBuilder('var')
    .graph.startTransition('"var"', buildKeywordParser(['var'], 'Keyword'), skipSeparators, 'name')
    .graph.state('name')
        .transition('var name', parseIdentifier, skipSeparators, 'value')
    .graph.state('value')
        .subGraph('no-value', eolGraph)
        .subGraph('message-literal', messageLiteralGraph)
        .subGraph('initial value expression', expressionGraph)
    .graph.build();
