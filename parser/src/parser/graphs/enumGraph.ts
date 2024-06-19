import { closeCurlyBracket, openCurlyBracket } from '#interfaces/charsets.js';
import { Graph } from '../stateMachine/Graph.js';
import { GraphBuilder } from '../stateMachine/GraphBuilder.js';
import {
    buildKeywordParser,
    parseIdentifier,
    skipSeparators,
    parseOpenScope,
    parseCloseScope,
} from '../stateMachine/SyntaxParser.js';
import { eolGraph } from './eolGraph.js';

/* Examples

    enum option

    enum option option1 option2 option3<EOL>

    enum option {
        option1
        option2
        option3
    }<EOL>

*/

const parseEnum = buildKeywordParser(['enum'], 'Keyword');

// prettier-ignore
export const enumGraph: Graph = new GraphBuilder('enum')
    .graph.start
        .transition('"enum"', parseEnum, skipSeparators, 'name')
    .graph.state('name')
        .transition('enum identifier', parseIdentifier, skipSeparators, 'definition')
    .graph.state('definition')
        .transition(openCurlyBracket, parseOpenScope, skipSeparators, 'scoped-value')
        .subGraph('empty-definition', eolGraph)
        .transition('enum value', parseIdentifier, skipSeparators, 'single-line-values')
    .graph.state('scoped-value')
        .transition(closeCurlyBracket, parseCloseScope, skipSeparators, 'end')
        .subGraph('scoped-eol', eolGraph, 'scoped-value')
        .transition('enum value', parseIdentifier, skipSeparators, 'scoped-eol')
    .graph.state('scoped-eol')
        .subGraph('scoped-value-eol', eolGraph, 'scoped-value')
    .graph.state('single-line-values')
        .transition('enum value', parseIdentifier, skipSeparators, 'single-line-values')
        .subGraph('single-line-eol', eolGraph)
    .graph.state('end')
        .subGraph('end', eolGraph)
    .graph.build();
