import { closeCurlyBracket, openCurlyBracket } from '#parser/charsets.js';
import { GraphBuilder } from '#parser/stateMachine/GraphBuilder.js';
import { skipSeparators, parseIdentifier, parseOpenScope, parseCloseScope } from '../stateMachine/SyntaxParser.js';
import { applicationConnectionGraph, configGraph, eolGraph, parseApplicationKeyword } from '../index.js';

// prettier-ignore
/* Examples

    application app

    application app {
        config {
            timeout 10
        }
        connection npl.io.Emitter emitter {
            config count 1
        }
    }<EOL>

*/
export function defineApplicationGraph(builder: GraphBuilder) {
    builder.clear()
    .graph.start
        .transition(parseApplicationKeyword, skipSeparators, 'name')
    .graph.state('name')
        .transition(parseIdentifier, skipSeparators, 'definition')
    .graph.state('definition')
        .transition(parseOpenScope, skipSeparators, 'statements')
        .subGraph('empty-definition', eolGraph)
    .graph.state('statements')
        .transition(parseCloseScope, skipSeparators, 'end')
        .subGraph('blank-line', eolGraph, 'statements')
        .subGraph('config', configGraph, 'statements')
        .subGraph('connection', applicationConnectionGraph, 'statements')
    .graph.state('end')
        .subGraph('end', eolGraph)
    .graph.build();
}
