import { closeAngleBracket } from '#interfaces/charsets.js';
import { GraphBuilder } from '../stateMachine/GraphBuilder.js';
import {
    buildKeywordParser,
    parseBasicType,
    skipSeparators,
    parseGenericOpen,
    parseMessageType,
    parseGenericClose,
} from '../stateMachine/SyntaxParser.js';

const dataTypeGraphBuilder = new GraphBuilder('data-type');

/* Examples

    map<string map<number, date[]>>

    boolean

    string[]

    app.RequestMessage

*/

// prettier-ignore
export const dataTypeGraph = dataTypeGraphBuilder
    .graph.start
        .transition('"string", "number", "date", "boolean", "string[]", "number[]", "date[]", "boolean[]"', parseBasicType, skipSeparators)
        .transition('map<K V>', parseGenericOpen, skipSeparators, 'generic-arg1')
        .transition('message-type or message-type[]', parseMessageType, skipSeparators)
    .graph.state('generic-arg1')
        .transition('"string", "number", "date"', buildKeywordParser(['string', 'number', 'date'], 'Type'), skipSeparators, 'generic-arg2')
    .graph.state('generic-arg2')
        .subGraph('data-type', dataTypeGraphBuilder.build(), 'generic-end')
    .graph.state('generic-end')
        .transition(closeAngleBracket, parseGenericClose, skipSeparators)
    .graph.build();
