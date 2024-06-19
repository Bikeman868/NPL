import { GraphBuilder } from '../stateMachine/GraphBuilder.js';
import { buildKeywordParser, parseIdentifier, skipSeparators } from '../stateMachine/SyntaxParser.js';
import { expressionGraph } from './expressionGraph.js';
import { messageLiteralGraph } from './messageLiteralGraph.js';

// prettier-ignore
/* Examples

    const name 'String value'<EOL>

    const daySeconds 60 * 60 * 24<EOL>

    const myMessage = MyMessage {
        message fieldName 'string value'
    }

*/
export const constGraph = new GraphBuilder('const')
    .graph.start
        .transition('"const"', buildKeywordParser(['const'], 'Keyword'), skipSeparators, 'name')
    .graph.state('name')
        .transition('const name', parseIdentifier, skipSeparators, 'value')
    .graph.state('value')
        .subGraph('message-literal', messageLiteralGraph)
        .subGraph('const-value', expressionGraph)
    .graph.build();
