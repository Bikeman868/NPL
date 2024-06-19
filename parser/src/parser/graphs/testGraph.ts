import { openCurlyBracket, closeCurlyBracket } from '#interfaces/charsets.js';
import { GraphBuilder } from '../stateMachine/GraphBuilder.js';
import {
    buildKeywordParser,
    skipSeparators,
    parseOpenScope,
    parseString,
    parseCloseScope,
} from '../stateMachine/SyntaxParser.js';
import { emitGraph } from './emitGraph.js';
import { eolGraph } from './eolGraph.js';
import { expectGraph } from './expectGraph.js';

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
export const testGraph = new GraphBuilder('unit-test')
    .graph.start
        .transition('"test"', parseTest, skipSeparators, 'description')
    .graph.state('description')
        .transition(openCurlyBracket, parseOpenScope, skipSeparators, 'statements')
        .transition('string literal', parseString, skipSeparators, 'definition')
    .graph.state('definition')
        .transition(openCurlyBracket, parseOpenScope, skipSeparators, 'statements')
    .graph.state('statements')
        .transition(closeCurlyBracket, parseCloseScope, skipSeparators, 'end')
        .subGraph('blank-line', eolGraph, 'statements')
        .subGraph('emit', emitGraph, 'statements')
        .subGraph('expect', expectGraph, 'statements')
    .graph.state('end')
        .subGraph('end', eolGraph)
    .graph.build();
