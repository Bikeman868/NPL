import { GraphBuilder } from '../stateMachine/GraphBuilder.js';
import { parseEol, parseEolComment, skipSeparators } from '../stateMachine/SyntaxParser.js';

// prettier-ignore
/* Examples

    <EOL>

    // Comment<EOL>

*/
export function defineEolGraph(builder: GraphBuilder) {
    builder.clear()
    .graph.start
        .transition(parseEol, skipSeparators)
        .transition(parseEolComment, skipSeparators, 'eol')
    .graph.state('eol')
        .transition(parseEol, skipSeparators)
    .graph.build();
}
