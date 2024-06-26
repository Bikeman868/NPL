import { GraphBuilder } from '../stateMachine/GraphBuilder.js';
import {
    skipSeparators,
    parseQualifiedIdentifier,
    parseOpenScope,
    parseIdentifier,
    parseCloseScope,
} from '../stateMachine/SyntaxParser.js';
import { eolGraph, parseAnyMessageTypeKeyword, parseAwaitKeyword, parseEmptyKeyword } from '../index.js';

// prettier-ignore
const messageTypeGraph = new GraphBuilder('await-message-type')
    .graph.startTransition(parseEmptyKeyword, skipSeparators)
    .graph.startTransition(parseAnyMessageTypeKeyword, skipSeparators)
    .graph.startTransition(parseQualifiedIdentifier, skipSeparators)
    .graph.build();

/* Examples

    await empty<EOL>

    await * theMessage<EOL>

    await {
        MessageType1 type1
        MessageType2 type2
    }<EOL>

*/

// prettier-ignore
export function defineProcessAwaitGraph(builder: GraphBuilder) {
    builder.clear()
    .graph.start
        .transition(parseAwaitKeyword, skipSeparators, 'message-type')
    .graph.state('message-type')
        .transition(parseOpenScope, skipSeparators, 'multiple-message-types')
        .subGraph('single-message-type', messageTypeGraph, 'single-identifier')
    .graph.state('single-identifier')
        .subGraph('single-no-identifier', eolGraph)
        .transition(parseIdentifier, skipSeparators, 'end')
    .graph.state('multiple-message-types')
        .transition(parseCloseScope)
        .subGraph('blank-line', eolGraph, 'multiple-message-types')
        .subGraph('multiple-message-type', messageTypeGraph, 'multiple-identifier')
    .graph.state('multiple-identifier')
        .transition(parseIdentifier, skipSeparators, 'multiple-end')
        .subGraph('multiple-no-identifier', eolGraph, 'multiple-message-types')
    .graph.state('multiple-end')
        .subGraph('multiple-end', eolGraph, 'multiple-message-types')
    .graph.state('end')
        .subGraph('end', eolGraph)
    .graph.build();
}
