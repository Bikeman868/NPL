import { closeCurlyBracket, openCurlyBracket } from '#interfaces/charsets.js';
import {
    buildKeywordParser,
    skipSeparators,
    parseOpenScope,
    parseCloseScope,
} from '../stateMachine/SyntaxParser.js';
import { eolGraph } from './eolGraph.js';
import { configFieldGraph, configGraphBuilder } from './index.js';


// prettier-ignore
/* Examples

    config timeout 20<EOL>

    config {
        timeout 20
        protocol 'http'
    }<EOL>
*/
configGraphBuilder
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
