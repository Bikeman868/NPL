import { closeCurlyBracket, openCurlyBracket } from '#interfaces/charsets.js';
import { Graph } from '../stateMachine/Graph.js';
import { GraphBuilder } from '../stateMachine/GraphBuilder.js';
import { skipSeparators, parseIdentifier, parseOpenScope, parseCloseScope } from '../stateMachine/SyntaxParser.js';
import { eolGraph } from './eolGraph.js';
import { expressionGraph } from './expressionGraph.js';

/* Examples

    fieldName expression<EOL>

    {
        fieldName expression
        fieldName expression
    }<EOL>
*/

// prettier-ignore
export const messageInitGraph: Graph = new GraphBuilder('message-init')
    .graph.start
        .transition('field name', parseIdentifier, skipSeparators, 'single-value')
        .transition(openCurlyBracket, parseOpenScope, skipSeparators, 'fields')
    .graph.state('single-value')
        .subGraph('single-value', expressionGraph)
    .graph.state('fields')
        .transition(closeCurlyBracket, parseCloseScope, skipSeparators, 'end')
        .subGraph('blank-line', eolGraph, 'fields')
        .transition('field name', parseIdentifier, skipSeparators, 'value')
    .graph.state('value')
        .subGraph('value', expressionGraph, 'fields')
    .graph.state('end')
        .subGraph('end', eolGraph)
    .graph.build();
