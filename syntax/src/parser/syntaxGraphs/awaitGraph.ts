import { GraphBuilder } from '../stateMachine/GraphBuilder.js';
import {
    skipSeparators,
    parseOpenScope,
    parseIdentifier,
    parseCloseScope,
} from '../stateMachine/SyntaxParser.js';
import { eolGraph, messageTypeSelectorGraph, parseAwaitKeyword } from '../index.js';

/* Examples

    await empty<EOL>

    await * theMessage<EOL>

    await {
        MessageType1 type1
        MessageType2 type2
    }<EOL>

*/

// prettier-ignore
export function defineAwaitGraph(builder: GraphBuilder) {
    builder.clear()
    .graph.start
        .transition(parseAwaitKeyword, skipSeparators, 'message-type')
    .graph.state('message-type')
        .transition(parseOpenScope, skipSeparators, 'multiple-message-types')
        .subGraph('single-message-type', messageTypeSelectorGraph, 'single-identifier')
    .graph.state('single-identifier')
        .subGraph('single-no-identifier', eolGraph)
        .transition(parseIdentifier, skipSeparators, 'end')
    .graph.state('multiple-message-types')
        .transition(parseCloseScope)
        .subGraph('blank-line', eolGraph, 'multiple-message-types')
        .subGraph('multiple-message-type', messageTypeSelectorGraph, 'multiple-identifier')
    .graph.state('multiple-identifier')
        .transition(parseIdentifier, skipSeparators, 'multiple-end')
        .subGraph('multiple-no-identifier', eolGraph, 'multiple-message-types')
    .graph.state('multiple-end')
        .subGraph('multiple-end', eolGraph, 'multiple-message-types')
    .graph.state('end')
        .subGraph('end', eolGraph)
    .graph.build();
}
