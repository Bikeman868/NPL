import { closeCurlyBracket, openCurlyBracket } from '#interfaces/charsets.js';
import { Graph } from '../stateMachine/Graph.js';
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

    config timeout 20<EOL>

    config {
        timeout 20
        protocol 'http'
    }<EOL>
*/

// prettier-ignore
const configFieldGraph: Graph = new GraphBuilder('config-field')
    .graph.start
        .transition('field name', parseIdentifier, skipSeparators, 'field-value')
    .graph.state('field-value')
        .subGraph('default value', expressionGraph)
    .graph.build();

// prettier-ignore
export const configGraph: Graph = new GraphBuilder('config')
    .graph.start
        .transition('"config"', buildKeywordParser(['config'], 'Keyword'), skipSeparators, 'definition')
    .graph.state('definition')
        .transition(openCurlyBracket, parseOpenScope, skipSeparators, 'fields')
        .subGraph('empty-definition', eolGraph)
        .subGraph('single-field', configFieldGraph)
    .graph.state('fields')
        .transition(closeCurlyBracket, parseCloseScope, skipSeparators, 'end')
        .subGraph('blank-line', eolGraph, 'fields')
        .subGraph('field', configFieldGraph, 'fields')
    .graph.state('end')
        .subGraph('end', eolGraph)
    .graph.build();
