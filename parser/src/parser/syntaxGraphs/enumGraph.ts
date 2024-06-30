import { GraphBuilder } from '#parser/stateMachine/GraphBuilder.js';
import { parseIdentifier, skipSeparators, parseOpenScope, parseCloseScope } from '../stateMachine/SyntaxParser.js';
import { eolGraph, parseEnumKeyword } from '../index.js';

// prettier-ignore
/* Examples

    enum option

    enum option option1 option2 option3<EOL>

    enum option {
        option1
        option2
        option3
    }<EOL>

*/
export function defineEnumGraph(builder: GraphBuilder) {
    builder.clear()
    .graph.start
        .transition(parseEnumKeyword, skipSeparators, 'name')
    .graph.state('name')
        .transition(parseIdentifier, skipSeparators, 'definition')
    .graph.state('definition')
        .transition(parseOpenScope, skipSeparators, 'scoped-value')
        .subGraph('empty-definition', eolGraph)
        .transition(parseIdentifier, skipSeparators, 'single-line-values')
    .graph.state('scoped-value')
        .transition(parseCloseScope, skipSeparators, 'end')
        .subGraph('scoped-eol', eolGraph, 'scoped-value')
        .transition(parseIdentifier, skipSeparators, 'scoped-eol')
    .graph.state('scoped-eol')
        .subGraph('scoped-value-eol', eolGraph, 'scoped-value')
    .graph.state('single-line-values')
        .transition(parseIdentifier, skipSeparators, 'single-line-values')
        .subGraph('single-line-eol', eolGraph)
    .graph.state('end')
        .subGraph('end', eolGraph)
    .graph.build();
}
