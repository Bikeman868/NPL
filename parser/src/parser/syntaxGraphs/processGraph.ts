import { GraphBuilder } from '../stateMachine/GraphBuilder.js';
import {
    buildKeywordParser,
    skipSeparators,
    parseIdentifier,
    parseOpenScope,
    parseCloseScope,
} from '../stateMachine/SyntaxParser.js';
import { configGraph, constGraph, eolGraph, messageDefinitionGraph, processAcceptGraph, testGraph } from '../index.js';

const parseProcess = buildKeywordParser(['process'], 'Keyword');

/* Examples

    process process1<EOL>

    process process1 {
        const count 1

        message InternalDebug string text

        accept InternalDebug debug {
            emit npl.io.console.Text message ...debug
        }

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
        .subGraph('config', configGraph, 'statements')
        .subGraph('const', constGraph, 'statements')
        .subGraph('message', messageDefinitionGraph, 'statements')
        .subGraph('accept', processAcceptGraph, 'statements')
        .subGraph('test', testGraph, 'statements')
    .graph.state('end')
        .subGraph('end', eolGraph)
    .graph.build();
}
