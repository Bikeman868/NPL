import { GraphBuilder } from '../stateMachine/GraphBuilder.js';
import { parseIdentifier, skipSeparators, parseOpenScope, parseCloseScope } from '../stateMachine/SyntaxParser.js';
import { configGraph, eolGraph, parsePipeKeyword, pipeRouteGraph } from '../index.js';

// prettier-ignore
/* Examples

    pipe myPipe<EOL>

    pipe myPipe {}<EOL>

    pipe myPipe {
        route * {
            clear
        }
    }<EOL>

*/
export function definePipeGraph(builder: GraphBuilder) {
    builder.clear()
    .graph.start
        .transition(parsePipeKeyword, skipSeparators, 'name')
    .graph.state('name')
        .transition(parseIdentifier, skipSeparators, 'definition')
    .graph.state('definition')
        .transition(parseOpenScope, skipSeparators, 'statements')
        .subGraph('empty-definition', eolGraph)
    .graph.state('statements')
        .transition(parseCloseScope, skipSeparators, 'end')
        .subGraph('blank-line', eolGraph, 'statements')
        .subGraph('route', pipeRouteGraph, 'statements')
        .subGraph('config', configGraph, 'statements')
    .graph.state('end')
        .subGraph('end', eolGraph)
    .graph.build();
}
