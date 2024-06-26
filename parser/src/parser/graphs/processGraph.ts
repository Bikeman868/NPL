import { GraphBuilder } from '../stateMachine/GraphBuilder.js';
import {
    buildKeywordParser,
    skipSeparators,
    parseIdentifier,
    parseOpenScope,
    parseCloseScope,
} from '../stateMachine/SyntaxParser.js';
import { configGraph, eolGraph, processAcceptGraph, testGraph } from '../index.js';

const parseProcess = buildKeywordParser(['process'], 'Keyword');

/* Examples

    process process1<EOL>

    process process1 {
        accept empty {
            emit MyMessage {
                message {
                    text 'Hello world'
                }
            }
        }
        test 'It should work' {
            emit empty
            expect MyMessage {
                message {
                    text 'Hello world'
                }
            }
        }
    }<EOL>

*/

// prettier-ignore
export function defineProcessGraph(builder: GraphBuilder) {
    builder.clear()
    .graph.start
        .transition(parseProcess, skipSeparators, 'name')
    .graph.state('name')
        .transition(parseIdentifier, skipSeparators, 'definition')
    .graph.state('definition')
        .transition(parseOpenScope, skipSeparators, 'statements')
        .subGraph('empty-definition', eolGraph)
    .graph.state('statements')
        .transition(parseCloseScope, skipSeparators, 'end')
        .subGraph('blank-line', eolGraph, 'statements')
        .subGraph('accept', processAcceptGraph, 'statements')
        .subGraph('test', testGraph, 'statements')
        .subGraph('config', configGraph, 'statements')
    .graph.state('end')
        .subGraph('end', eolGraph)
    .graph.build();
}
