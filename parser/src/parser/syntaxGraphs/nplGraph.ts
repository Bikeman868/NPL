import { GraphBuilder } from '../stateMachine/GraphBuilder.js';
import { eolGraph, namespaceGraph, usingGraph } from '../index.js';

// prettier-ignore
/* Examples

    <EOL><EOL>
    using ns1.ns2
    using ns1.ns3
    <EOL>
    namespace ns4 {
        application app
    }<EOL>

*/
export function defineNplGraph(builder: GraphBuilder) {
    builder.clear()
    .graph.start
        .subGraph('eol', eolGraph)
        .subGraph('using', usingGraph)
        .subGraph('namespace', namespaceGraph)
    .graph.build();
}
