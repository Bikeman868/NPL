import { GraphBuilder } from '../stateMachine/GraphBuilder.js';
import { parseEol, parseEolComment, skipSeparators } from '../stateMachine/SyntaxParser.js';

/* Examples

    <EOL>

    // Comment<EOL>

*/

// prettier-ignore
export const eolGraph = new GraphBuilder('eol')
    .graph.start
        .transition('line break', parseEol, skipSeparators)
        .transition('//', parseEolComment, skipSeparators, 'eol')
    .graph.state('eol')
        .transition('line break', parseEol, skipSeparators)
    .graph.build();
