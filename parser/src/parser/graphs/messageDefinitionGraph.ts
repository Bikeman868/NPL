import { closeCurlyBracket, openCurlyBracket } from '#interfaces/charsets.js';
import { Graph } from '../stateMachine/Graph.js';
import { GraphBuilder } from '../stateMachine/GraphBuilder.js';
import {
    buildKeywordParser,
    skipSeparators,
    parseIdentifier,
    parseOpenScope,
    parseCloseScope,
} from '../stateMachine/SyntaxParser.js';
import { dataTypeGraph } from './dataTypeGraph.js';
import { eolGraph } from './eolGraph.js';

const parseMessage = buildKeywordParser(['message'], 'Keyword');

/* Examples:
    string[] myString

    boolean  flag
*/
// prettier-ignore
const messageFieldGraph: Graph = new GraphBuilder('message-field')
    .graph.start
        .subGraph('type', dataTypeGraph, 'identifier')
    .graph.state('identifier')
        .transition('message field name', parseIdentifier, skipSeparators)
    .graph.build();

/* Examples
    message TestMessage<EOL>

    message TestMessage // Comment<EOL>

    message TestMessage string onlyField<EOL>

    message TestMessage {} // Comment<EOL>

    message TestMessage { // Comment
    } // Comment<EOL>

    message TextMessage {
        string field1
        string field2
    } // Comment<EOL>
*/

// prettier-ignore
export const messageDefinitionGraph: Graph = new GraphBuilder('message-type')
    .graph.start
        .transition('"message"', parseMessage, skipSeparators, 'name')
    .graph.state('name')
        .transition('message identifier', parseIdentifier, skipSeparators, 'definition')
    .graph.state('definition')
        .transition(openCurlyBracket, parseOpenScope, skipSeparators, 'fields')
        .subGraph('empty-definition', eolGraph)
        .subGraph('single-field', messageFieldGraph, 'end')
    .graph.state('fields')
        .transition(closeCurlyBracket, parseCloseScope, skipSeparators, 'end')
        .subGraph('blank-line', eolGraph, "fields")
        .subGraph('field', messageFieldGraph, 'field-end')
    .graph.state('field-end')
        .subGraph('field-end', eolGraph, 'fields')
    .graph.state('end')
        .subGraph('end', eolGraph)
    .graph.build();
