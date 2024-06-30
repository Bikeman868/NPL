import { GraphBuilder } from '../stateMachine/GraphBuilder.js';
import {
    skipSeparators,
    parseOpenScope,
    parseCloseScope,
    parseIdentifier,
} from '../stateMachine/SyntaxParser.js';
import { eolGraph, assignmentExpressionGraph, parseJsonKeyword } from '../index.js';

// prettier-ignore
/* Examples

    json '{"name": "My name"}'<EOL>

*/
export function defineMessageJsonGraph(builder: GraphBuilder) {
    builder.clear()
    .graph.start
        .transition(parseJsonKeyword, skipSeparators, 'json')
    .graph.state('json')
        .subGraph('expression', assignmentExpressionGraph)
    .graph.build();
}
