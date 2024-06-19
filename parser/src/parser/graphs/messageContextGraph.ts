import { openCurlyBracket, closeCurlyBracket } from '#interfaces/charsets.js';
import { GraphBuilder } from '../stateMachine/GraphBuilder.js';
import { buildKeywordParser, skipSeparators, parseOpenScope, parseCloseScope } from '../stateMachine/SyntaxParser.js';
import { eolGraph } from './eolGraph.js';
import { messageInitGraph } from './messageInitGraph.js';

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
export const messageContextGraph = new GraphBuilder('message-context')
    .graph.start
        .transition('"context"', parseContextKeyword, skipSeparators, 'definition')
    .graph.state('definition')
        .transition(openCurlyBracket, parseOpenScope, skipSeparators, 'scope-block')
        .transition('"origin", "network", "message"', parseContextType, skipSeparators, 'single-context')
    .graph.state('single-context')
        .subGraph('single-context', messageInitGraph)
    .graph.state('scope-block')
        .transition(closeCurlyBracket, parseCloseScope, skipSeparators, 'end')
        .subGraph('blank-line', eolGraph, 'scope-block')
        .transition('"origin", "network", "message"', parseContextType, skipSeparators, 'context')
    .graph.state('context')
        .subGraph('context', messageInitGraph, "scope-block")
    .graph.state('end')
        .subGraph('end', eolGraph)
    .graph.build();
