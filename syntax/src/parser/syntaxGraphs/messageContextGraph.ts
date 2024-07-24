import { GraphBuilder } from '../stateMachine/GraphBuilder.js';
import { buildKeywordParser, skipSeparators, parseOpenScope, parseCloseScope } from '../stateMachine/SyntaxParser.js';
import { eolGraph, messageInitGraph } from '../index.js';

const parseContextKeyword = buildKeywordParser(['context'], 'Keyword');
const parseContextType = buildKeywordParser(['origin', 'message', 'network'], 'Keyword');

// prettier-ignore
/* Examples

    context message fieldName fieldValue<EOL>

    context network {
        field1 value1
        field2 value2
        field3 value3
    }<EOL>

    context {
        network {
            field1 value1
            field2 value2
            field3 value3
        }
        origin {
            field1 value1
            field2 value2
            field3 value3
        }
    }<EOL>
*/
export function defineMessageContextGraph(builder: GraphBuilder) {
    builder.clear()
    .graph.start
        .transition(parseContextKeyword, skipSeparators, 'definition')
    .graph.state('definition')
        .transition(parseOpenScope, skipSeparators, 'scope-block')
        .transition(parseContextType, skipSeparators, 'single-context')
    .graph.state('single-context')
        .subGraph('single-context', messageInitGraph)
    .graph.state('scope-block')
        .transition(parseCloseScope, skipSeparators, 'end')
        .subGraph('blank-line', eolGraph, 'scope-block')
        .transition(parseContextType, skipSeparators, 'context')
    .graph.state('context')
        .subGraph('context', messageInitGraph, "scope-block")
    .graph.state('end')
        .subGraph('end', eolGraph)
    .graph.build();
}
