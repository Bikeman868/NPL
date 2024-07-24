import { GraphBuilder } from '../stateMachine/GraphBuilder.js';
import {
    skipSeparators,
    parseOpenScope,
    parseIdentifier,
    parseCloseScope,
} from '../stateMachine/SyntaxParser.js';
import { 
    configGraph, 
    constGraph, 
    destinationListGraph, 
    eolGraph, 
    messageDefinitionGraph, 
    messageTypeSelectorGraph, 
    parseDefaultKeyword, 
    parseEgressKeyword, 
    parseIngressKeyword, 
    parseNetworkKeyword, 
    pipeGraph, 
    processGraph,
} from '../index.js';

// prettier-ignore
/* Examples

    ingress entrypoint<EOL>

    ingress default network network1.entrypoint1<EOL>

    ingress entrypoint pipe myPipe<EOL>

    ingress entrypoint {
        pipe pipe1
        process process1
    }<EOL>

*/
const ingressGraph = new GraphBuilder('network-ingress')
    .graph.start
        .transition(parseIngressKeyword, skipSeparators, 'name')
    .graph.state('name')
        .transition(parseDefaultKeyword, skipSeparators, 'destination')
        .transition(parseIdentifier, skipSeparators, 'destination')
    .graph.state('destination')
        .subGraph('destination-list', destinationListGraph)
        .subGraph('no-destination', eolGraph)
    .graph.build();

// prettier-ignore
/* Examples

    egress entrypoint<EOL>
    
    egress responses empty<EOL>

    egress responses *<EOL>

    egress responses {
        empty
        MyMessageType
    }<EOL>

    egress responses { empty MyMessageType }<EOL>

*/
const egressGraph = new GraphBuilder('network-egress')
    .graph.start
        .transition(parseEgressKeyword, skipSeparators, 'name')
    .graph.state('name')
        .transition(parseDefaultKeyword, skipSeparators, 'message-type')
        .transition(parseIdentifier, skipSeparators, 'message-type')
    .graph.state('message-type')
        .transition(parseOpenScope, skipSeparators, 'multiple-types')
        .subGraph('empty-definition', eolGraph)
        .subGraph('message-type', messageTypeSelectorGraph, 'end')
    .graph.state('multiple-types')
        .transition(parseCloseScope, skipSeparators, 'end')
        .subGraph('message-types', messageTypeSelectorGraph, 'multiple-types')
        .subGraph('blank-line', eolGraph, 'multiple-types')
    .graph.state('end')
        .subGraph('end', eolGraph)
    .graph.build();

// prettier-ignore
/* Examples

    network network1

    network network1 ingress entrypoint1 network network2.entrypoint1<EOL>

    network network1 egress entrypoint1 MyMessageType<EOL>

    network network1 {
        ingress default process process1
        egress default *
        ingress namedEntrypoint process process2
        egress namedEntrypoint appNamespace.AppMessageType
    }<EOL>

    network network1 {
        egress entrypoint1 {
            MessageType1
            MessageType2
            MessageType3
        }
        ingress entrypoint1 {
            pipe pipe1
            network network2
        }
        config {
        }
        process process1 {
        }
        pipe pipe1 {
        }
    }<EOL>
    
*/
export function defineNetworkGraph(builder: GraphBuilder) {
    builder.clear()
    .graph.start
        .transition(parseNetworkKeyword, skipSeparators, 'name')
    .graph.state('name')
        .transition(parseIdentifier, skipSeparators, 'definition')
    .graph.state('definition')
        .transition(parseOpenScope, skipSeparators, 'statement-block')
        .subGraph('empty-definition', eolGraph)
        .subGraph('single-ingress', ingressGraph)
        .subGraph('single-egress', egressGraph)
    .graph.state('statement-block')
        .transition(parseCloseScope, skipSeparators, 'end')
        .subGraph('blank-line', eolGraph, 'statement-block')
        .subGraph('ingress', ingressGraph, 'statement-block')
        .subGraph('egress', egressGraph, 'statement-block')
        .subGraph('process', processGraph, 'statement-block')
        .subGraph('pipe', pipeGraph, 'statement-block')
        .subGraph('config', configGraph, 'statement-block')
        .subGraph('message', messageDefinitionGraph, 'statement-block')
        .subGraph('const', constGraph, 'statement-block')
    .graph.state('end')
        .subGraph('end', eolGraph)
    .graph.build();
}
