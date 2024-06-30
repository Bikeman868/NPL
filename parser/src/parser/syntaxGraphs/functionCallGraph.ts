import { comma } from '#interfaces/charsets.js';
import { GraphBuilder } from '../stateMachine/GraphBuilder.js';
import { buildSymbolParser, skipSeparators } from '../stateMachine/SyntaxParser.js';
import {
    assignmentExpressionGraph,
    eolGraph,
    parseEndFunctionCallSymbol,
    parseStartFunctionCallSymbol,
} from '../index.js';

// prettier-ignore
/* Examples

    (
        list[3]
        myString.indexOf(' ')
        99
    )
*/
export function defineFunctionCallGraph(builder: GraphBuilder) {
    builder.clear()
    .graph.start
        .transition(parseStartFunctionCallSymbol, skipSeparators, 'parameter')
    .graph.state('parameter')
        .transition(parseEndFunctionCallSymbol, skipSeparators)
        .subGraph('expression', assignmentExpressionGraph, 'parameter')
        .subGraph('line-break', eolGraph, 'parameter')
    .graph.build();
}
