import { closeCurlyBracket, openCurlyBracket } from '#interfaces/charsets.js';
import { GraphBuilder } from '../stateMachine/GraphBuilder.js';
import {
    parseIdentifier,
    skipSeparators,
    parseOpenScope,
    parseCloseScope,
} from '../stateMachine/SyntaxParser.js';
import { eolGraph, parsePipeKeyword, pipeRouteGraph } from './index.js';


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
        .transition('"pipe"', parsePipeKeyword, skipSeparators, 'name')
    .graph.state('name')
        .transition('pipe name', parseIdentifier, skipSeparators, 'definition')
    .graph.state('definition')
        .transition(openCurlyBracket, parseOpenScope, skipSeparators, 'statements')
        .subGraph('empty-definition', eolGraph)
    .graph.state('statements')
        .transition(closeCurlyBracket, parseCloseScope, skipSeparators, 'end')
        .subGraph('blank-line', eolGraph, 'statements')
        .subGraph('route', pipeRouteGraph, 'statements')
    .graph.state('end')
        .subGraph('end', eolGraph)
    .graph.build();
}