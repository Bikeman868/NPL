import {
    skipSeparators,
    parseIdentifier,
} from '../stateMachine/SyntaxParser.js';
import { expressionGraph } from './expressionGraph.js';
import { configFieldGraphBuilder } from './index.js';


// prettier-ignore
/* Examples

    timeout 20<EOL>

*/
configFieldGraphBuilder
    .graph.start
        .transition('field name', parseIdentifier, skipSeparators, 'field-value')
    .graph.state('field-value')
        .subGraph('default value', expressionGraph)
    .graph.build();

