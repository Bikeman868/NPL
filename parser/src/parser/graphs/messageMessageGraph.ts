import { openCurlyBracket, closeCurlyBracket } from '#interfaces/charsets.js';
import { GraphBuilder } from '../stateMachine/GraphBuilder.js';
import {
    buildKeywordParser,
    skipSeparators,
    parseOpenScope,
    parseCloseScope,
    parseIdentifier,
} from '../stateMachine/SyntaxParser.js';
import { eolGraph } from './eolGraph.js';
import { expressionGraph } from './expressionGraph.js';

/* Examples

    message fieldName fieldValue<EOL>

    message {
        field1 value1
        field2 value2
    }<EOL>

*/

const parseMessage = buildKeywordParser(['message'], 'Keyword');

// prettier-ignore
export const messageMessageGraph = new GraphBuilder('message-message')
    .graph.start
        .transition('"message"', parseMessage, skipSeparators, 'definition')
    .graph.state('definition')
        .transition(openCurlyBracket, parseOpenScope, skipSeparators, 'fields')
        .transition('message field name', parseIdentifier, skipSeparators, 'single-field')
    .graph.state('fields')
        .transition(closeCurlyBracket, parseCloseScope, skipSeparators, 'end')
        .subGraph('blank-line', eolGraph, 'fields')
        .transition('message field name', parseIdentifier, skipSeparators, 'field-value')
    .graph.state('single-field')
        .subGraph('single-expression', expressionGraph)
    .graph.state('field-value')
        .subGraph('expression', expressionGraph, 'fields')
    .graph.state('end')
        .subGraph('end', eolGraph)
    .graph.build();
