import { GraphBuilder } from '../stateMachine/GraphBuilder.js';
import {
    buildKeywordParser,
    parseIdentifier,
    parseQualifiedIdentifier,
    skipSeparators,
} from '../stateMachine/SyntaxParser.js';
import { expressionGraph } from './expressionGraph.js';

/* Examples

    set name 'String value'<EOL>

    set nextId message.id + 1<EOL>

*/

// prettier-ignore
export const setGraph = new GraphBuilder('set')
    .graph.startTransition('"set"', buildKeywordParser(['set'], 'Keyword'), skipSeparators, 'name')
    .graph.state('name')
        .transition('const name', parseQualifiedIdentifier, skipSeparators, 'value')
    .graph.state('value')
        .subGraph('expression', expressionGraph)
    .graph.build();
