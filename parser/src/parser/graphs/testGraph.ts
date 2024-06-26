import { openCurlyBracket, closeCurlyBracket } from '#interfaces/charsets.js';
import { GraphBuilder } from '../stateMachine/GraphBuilder.js';
import {
    buildKeywordParser,
    skipSeparators,
    parseOpenScope,
    parseString,
    parseCloseScope,
} from '../stateMachine/SyntaxParser.js';
import { emitGraph, eolGraph, expectGraph } from '../index.js';

const parseTest = buildKeywordParser(['test'], 'Keyword');

/* Examples

    test 'My unit test' {
        emit empty
        expect MyMessage
    }<EOL>

    test {
        emit empty
        expect MyMessage {
            context origin name 'the name'
        }
    }<EOL>

*/

// prettier-ignore
export function defineTestGraph(builder: GraphBuilder) {
    builder.clear()
    .graph.start
        .transition(parseTest, skipSeparators, 'description')
    .graph.state('description')
        .transition(parseOpenScope, skipSeparators, 'statements')
        .transition(parseString, skipSeparators, 'definition')
    .graph.state('definition')
        .transition(parseOpenScope, skipSeparators, 'statements')
    .graph.state('statements')
        .transition(parseCloseScope, skipSeparators, 'end')
        .subGraph('blank-line', eolGraph, 'statements')
        .subGraph('emit', emitGraph, 'statements')
        .subGraph('expect', expectGraph, 'statements')
    .graph.state('end')
        .subGraph('end', eolGraph)
    .graph.build();
}
