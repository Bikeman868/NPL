import { closeCurlyBracket, openCurlyBracket } from '#interfaces/charsets.js';
import { GraphBuilder } from '#parser/stateMachine/GraphBuilder.js';
import {
    buildKeywordParser,
    skipSeparators,
    parseOpenScope,
    parseCloseScope,
} from '../stateMachine/SyntaxParser.js';
import { configFieldGraph, eolGraph } from './index.js';


// prettier-ignore
/* Examples

    config timeout 20<EOL>

    config {
        timeout 20
        protocol 'http'
    }<EOL>
*/
export function defineConfigGraph(builder: GraphBuilder) {
    builder.clear()
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
}
