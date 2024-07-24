import { GraphBuilder } from '#parser/stateMachine/GraphBuilder.js';
import {
    parseOpenScope,
    skipSeparators,
    parseQualifiedIdentifier,
    parseIdentifier,
    parseCloseScope,
} from '../stateMachine/SyntaxParser.js';
import { 
    parseIngressKeyword, 
    parseEgressKeyword, 
    configGraph, 
    eolGraph, 
    parseConnectionKeyword, 
    messageTypeSelectorGraph,
} from '../index.js';
import { SyntaxGraph } from '#interfaces/SyntaxGraph.js';

const connectionRouteGraphBuilder: GraphBuilder = new GraphBuilder('connection-route');
const connectionRouteGraph: SyntaxGraph = connectionRouteGraphBuilder.build();

// prettier-ignore
/* Examples

    Request network1.input<EOL>

    empty myNetwork<EOL>

    * namespace1.network1.entrypoint<EOL>

    {
        Response network1
        * network2
    }<EOL>

*/
connectionRouteGraphBuilder
    .graph.start
        .transition(parseOpenScope, skipSeparators, 'routes')
        .subGraph('message-type', messageTypeSelectorGraph, 'network-endpoint')
    .graph.state('network-endpoint')
        .transition(parseQualifiedIdentifier, skipSeparators, 'end')
    .graph.state('routes')
        .transition(parseCloseScope, skipSeparators, 'end')
        .subGraph('blank-line', eolGraph, 'routes')
        .subGraph('route-message-type', messageTypeSelectorGraph, 'route-network-endpoint')
    .graph.state('route-network-endpoint')
        .transition(parseQualifiedIdentifier, skipSeparators, 'routes')
    .graph.state('end')
        .subGraph('end', eolGraph)
    .graph.build();

// prettier-ignore
/* Examples

    connection npl.http.HttpListener http ingress * httpNetwork.httpRequest

    connection npl.io.Emitter emitter {
        ingress Request network1.input
        egress {
            Response network1
            Response network2
        }
    }<EOL>

    connection npl.io.Emitter emitter {
        ingress egress * network1.input
    }<EOL>

*/
export function defineApplicationConnectionGraph(builder: GraphBuilder) {
    builder.clear()
    .graph.start
        .transition(parseConnectionKeyword, skipSeparators, 'connection-type')
    .graph.state('connection-type')
        .transition(parseQualifiedIdentifier, skipSeparators, 'connection-name')
    .graph.state('connection-name')
        .transition(parseIdentifier, skipSeparators, 'definition')
    .graph.state('definition')
        .transition(parseOpenScope, skipSeparators, 'statements')
        .transition(parseIngressKeyword, skipSeparators, 'ingress-statement')
        .transition(parseEgressKeyword, skipSeparators, 'egress-statement')

    .graph.state('ingress-statement')
        .transition(parseEgressKeyword, skipSeparators, 'statement-route')
        .subGraph('ingress-statement-route', connectionRouteGraph)
    .graph.state('egress-statement')
        .transition(parseIngressKeyword, skipSeparators, 'statement-route')
        .subGraph('egress-statement-route', connectionRouteGraph)
    .graph.state('statement-route')
        .subGraph('statement-route', connectionRouteGraph)

    .graph.state('statements')
        .transition(parseCloseScope, skipSeparators, 'end')
        .transition(parseIngressKeyword, skipSeparators, 'ingress')
        .transition(parseEgressKeyword, skipSeparators, 'egress')
        .subGraph('blank-line', eolGraph, 'statements')
        .subGraph('config', configGraph, 'statements')
    .graph.state('ingress')
        .transition(parseEgressKeyword, skipSeparators, 'ingress-egress')
        .subGraph('ingress-route', connectionRouteGraph, 'statements')
    .graph.state('egress')
        .transition(parseIngressKeyword, skipSeparators, 'ingress-egress')
        .subGraph('egress-route', connectionRouteGraph, 'statements')
    .graph.state('ingress-egress')
        .subGraph('route', connectionRouteGraph, 'statements')
    .graph.state('end')
        .subGraph('end', eolGraph)
    .graph.build();
}
