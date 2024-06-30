import { GraphBuilder } from 'parser/stateMachine/GraphBuilder.js';
import {
    buildKeywordParser,
    parseBasicType,
    skipSeparators,
    parseGenericOpen,
    parseMessageType,
    parseGenericClose,
} from '../stateMachine/SyntaxParser.js';
import { dataTypeGraph } from '../index.js';

// prettier-ignore
/* Examples

    map<string map<number, date[]>>

    boolean

    string[]

    date

    app.RequestMessage

*/
export function defineDataTypeGraph(builder: GraphBuilder) {
    builder.clear()
    .graph.start
        .transition(parseBasicType, skipSeparators)
        .transition(parseGenericOpen, skipSeparators, 'generic-arg1')
        .transition(parseMessageType, skipSeparators)
    .graph.state('generic-arg1')
        .transition(buildKeywordParser(['string', 'number', 'date'], 'Type'), skipSeparators, 'generic-arg2')
    .graph.state('generic-arg2')
        .subGraph('data-type', dataTypeGraph, 'generic-end')
    .graph.state('generic-end')
        .transition(parseGenericClose, skipSeparators)
    .graph.build();
}
