import { GraphBuilder } from '../stateMachine/GraphBuilder.js';
import {
    buildKeywordParser,
    parseQualifiedIdentifier,
    skipSeparators,
} from '../stateMachine/SyntaxParser.js';
import { expressionGraph, parseSetKeyword } from './index.js';

/* Examples

    set name 'String value'<EOL>

    set nextId message.id + 1<EOL>

*/

// prettier-ignore
export function defineSetGraph(builder: GraphBuilder) {
    builder.clear()
    .graph.start
        .transition('"set"', parseSetKeyword, skipSeparators, 'name')
    .graph.state('name')
        .transition('const name', parseQualifiedIdentifier, skipSeparators, 'value')
    .graph.state('value')
        .subGraph('expression', expressionGraph)
    .graph.build();
}