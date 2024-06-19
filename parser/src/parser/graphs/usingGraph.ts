import { GraphBuilder } from '../stateMachine/GraphBuilder.js';
import {
    buildKeywordParser,
    parseQualifiedIdentifier,
    skipSeparators,
    skipWhitespace,
} from '../stateMachine/SyntaxParser.js';

/* Examples

    using namespace1<EOL>

    using namespace1.namespace2<EOL>
*/

// prettier-ignore
export const usingGraph = new GraphBuilder('using')
    .graph.start
        .transition('"using"', buildKeywordParser(['using'], 'Keyword'), skipSeparators, 'namespace')
    .graph.state('namespace')
        .transition('namespace name', parseQualifiedIdentifier, skipWhitespace)
    .graph.build();
