import { openCurlyBracket, closeCurlyBracket } from '#interfaces/charsets.js';
import { GraphBuilder } from '../stateMachine/GraphBuilder.js';
import {
    buildKeywordParser,
    buildEolParser,
    buildCloseScopeParser,
    buildIdentifierParser,
    skipSeparators,
    parseQualifiedIdentifier,
    parseOpenScope,
    parseIdentifier,
} from '../stateMachine/SyntaxParser.js';
import { eolGraph } from './eolGraph.js';

const parseAwait = buildKeywordParser(['await'], 'Keyword');
const parseEmpty = buildKeywordParser(['empty'], 'Keyword');
const parseAll = buildKeywordParser(['*'], 'Keyword');

// prettier-ignore
const messageTypeGraph = new GraphBuilder('await-message-type')
    .graph.startTransition('"empty"', parseEmpty, skipSeparators)
    .graph.startTransition('"*"', parseAll, skipSeparators)
    .graph.startTransition('identifier or message type', parseQualifiedIdentifier, skipSeparators)
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
export const processAwaitGraph = new GraphBuilder('await')
    .graph.start
        .transition('"await"', parseAwait, skipSeparators, 'message-type')
    .graph.state('message-type')
        .transition(openCurlyBracket, parseOpenScope, skipSeparators, 'multiple-message-types')
        .subGraph('single-message-type', messageTypeGraph, 'single-identifier')
    .graph.state('single-identifier')
        .subGraph('single-no-identifier', eolGraph)
        .transition('single-identifier', parseIdentifier, skipSeparators, 'end')
    .graph.state('multiple-message-types')
        .transition(closeCurlyBracket, buildCloseScopeParser())
        .subGraph('blank-line', eolGraph, 'multiple-message-types')
        .subGraph('multiple-message-type', messageTypeGraph, 'multiple-identifier')
    .graph.state('multiple-identifier')
        .transition('multiple-identifier', parseIdentifier, skipSeparators, 'multiple-end')
        .subGraph('multiple-no-identifier', eolGraph, 'multiple-message-types')
    .graph.state('multiple-end')
        .subGraph('multiple-end', eolGraph, 'multiple-message-types')
    .graph.state('end')
        .subGraph('end', eolGraph)
    .graph.build();
