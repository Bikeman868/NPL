import { GraphBuilder } from '../stateMachine/GraphBuilder.js';
import { skipSeparators, parseQualifiedIdentifier } from '../stateMachine/SyntaxParser.js';
import { parseAnyMessageTypeKeyword, parseEmptyKeyword } from '../index.js';

// prettier-ignore
/* Examples

    *

    empty

    namespace.MyMessage

*/
export function defineMessageTypeSelectorGraph(builder: GraphBuilder) {
    builder.clear()
    .graph.start
        .transition(parseEmptyKeyword, skipSeparators)
        .transition(parseAnyMessageTypeKeyword, skipSeparators)
        .transition(parseQualifiedIdentifier, skipSeparators)
    .graph.build();
}
