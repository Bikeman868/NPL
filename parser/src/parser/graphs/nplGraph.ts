import { GraphBuilder } from '../stateMachine/GraphBuilder.js';
import { usingGraph } from './usingGraph.js';
import { namespaceGraph } from './namespaceGraph.js';
import { eolGraph } from './eolGraph.js';

/* Examples

    <EOL><EOL>
    using ns1.ns2
    using ns1.ns3
    <EOL>
    namespace ns4 {
        application app
    }<EOL>

*/

// prettier-ignore
export const nplGraph = new GraphBuilder('npl')
    .graph.start
        .subGraph('eol', eolGraph)
        .subGraph('using', usingGraph)
        .subGraph('namespace', namespaceGraph)
    .graph.build();
