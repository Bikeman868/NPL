import { 
    buildKeywordParser, 
    parseQualifiedIdentifier, 
    skipSeparators,
} from '../stateMachine/SyntaxParser.js';
import { destinationGraphBuilder } from './index.js';

// prettier-ignore
/* Examples

    network network1

    pipe namespace.pipe2

    process ns1.ns2.process1

*/
destinationGraphBuilder
    .graph.start
        .transition('"network", "process", "pipe"', buildKeywordParser(['network', 'process', 'pipe'], 'Keyword'), skipSeparators, 'name')
    .graph.state('name')
        .transition('name', parseQualifiedIdentifier, skipSeparators)
    .graph.build();
