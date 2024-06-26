import {
    applicationConnectionGraphBuilder,
    applicationGraphBuilder,
    configGraphBuilder,
    configFieldGraphBuilder,
    constGraphBuilder,
    dataTypeGraphBuilder,
    destinationGraphBuilder,
    destinationListGraphBuilder,
    emitGraphBuilder,
    enumGraphBuilder,
    eolGraphBuilder,
    messageMessageGraphBuilder,
    messageLiteralGraphBuilder,
    messageInitGraphBuilder,
    messageDefinitionGraphBuilder,
    messageContextGraphBuilder,
    conditionalExpressionGraphBuilder,
    expectGraphBuilder,
    namespaceGraphBuilder,
    nplGraphBuilder,
    pipeGraphBuilder,
    processAcceptGraphBuilder,
    pipeRouteGraphBuilder,
    processAwaitGraphBuilder,
    processGraphBuilder,
    processRouteGraphBuilder,
    routingStatementGraphBuilder,
    setGraphBuilder,
    testGraphBuilder,
    usingGraphBuilder,
    varGraphBuilder,
    nplGraph,
    networkGraphBuilder,
    messageRouteGraphBuilder,
    assignmentExpressionGraphBuilder,
    messageConstructorGraphBuilder,
} from './index.js';

import { defineDataTypeGraph } from './graphs/dataTypeGraph.js';
import { SyntaxGraph } from '#interfaces/SyntaxGraph.js';
import { defineApplicationConnectionGraph } from './graphs/applicationConnectionGraph.js';
import { defineApplicationGraph } from './graphs/applicationGraph.js';
import { defineConfigFieldGraph } from './graphs/configFieldGraph.js';
import { defineConfigGraph } from './graphs/configGraph.js';
import { defineConstGraph } from './graphs/constGraph.js';
import { defineDestinationGraph } from './graphs/destinationGraph.js';
import { defineDestinationListGraph } from './graphs/destinationListGraph.js';
import { defineEmitGraph } from './graphs/emitGraph.js';
import { defineEnumGraph } from './graphs/enumGraph.js';
import { defineEolGraph } from './graphs/eolGraph.js';
import { defineExpectGraph } from './graphs/expectGraph.js';
import { defineMessageContextGraph } from './graphs/messageContextGraph.js';
import { defineMessageDefinitionGraph } from './graphs/messageDefinitionGraph.js';
import { defineMessageInitGraph } from './graphs/messageInitGraph.js';
import { defineMessageLiteralGraph } from './graphs/messageLiteralGraph.js';
import { defineMessageMessageGraph } from './graphs/messageMessageGraph.js';
import { defineConditionalExpressionGraph, defineAssignmentExpressionGraph } from './graphs/expressionGraph.js';
import { defineNamespaceGraph } from './graphs/namespaceGraph.js';
import { defineNplGraph } from './graphs/nplGraph.js';
import { definePipeGraph } from './graphs/pipeGraph.js';
import { definePipeRouteGraph } from './graphs/pipeRouteGraph.js';
import { defineProcessAcceptGraph } from './graphs/processAcceptGraph.js';
import { defineProcessAwaitGraph } from './graphs/processAwaitGraph.js';
import { defineProcessGraph } from './graphs/processGraph.js';
import { defineProcessRouteGraph } from './graphs/processRouteGraph.js';
import { defineRoutingStatementGraph } from './graphs/routingStatementGraph.js';
import { defineSetGraph } from './graphs/setGraph.js';
import { defineTestGraph } from './graphs/testGraph.js';
import { defineUsingGraph } from './graphs/usingGraph.js';
import { defineVarGraph } from './graphs/varGraph.js';
import { defineNetworkGraph } from './graphs/networkGraph.js';
import { defineMessageRouteGraph } from './graphs/messageRouteGraph.js';
import { defineMessageConstructorGraph } from './graphs/messageConstructorGraph.js';

export function buildNplSyntaxGraph(): SyntaxGraph {
    defineApplicationConnectionGraph(applicationConnectionGraphBuilder);
    defineApplicationGraph(applicationGraphBuilder);
    defineAssignmentExpressionGraph(assignmentExpressionGraphBuilder);
    defineConditionalExpressionGraph(conditionalExpressionGraphBuilder);
    defineConfigFieldGraph(configFieldGraphBuilder);
    defineConfigGraph(configGraphBuilder);
    defineConstGraph(constGraphBuilder);
    defineDataTypeGraph(dataTypeGraphBuilder);
    defineDestinationGraph(destinationGraphBuilder);
    defineDestinationListGraph(destinationListGraphBuilder);
    defineEmitGraph(emitGraphBuilder);
    defineEnumGraph(enumGraphBuilder);
    defineEolGraph(eolGraphBuilder);
    defineExpectGraph(expectGraphBuilder);
    defineMessageConstructorGraph(messageConstructorGraphBuilder);
    defineMessageContextGraph(messageContextGraphBuilder);
    defineMessageDefinitionGraph(messageDefinitionGraphBuilder);
    defineMessageInitGraph(messageInitGraphBuilder);
    defineMessageLiteralGraph(messageLiteralGraphBuilder);
    defineMessageMessageGraph(messageMessageGraphBuilder);
    defineMessageRouteGraph(messageRouteGraphBuilder);
    defineNamespaceGraph(namespaceGraphBuilder);
    defineNetworkGraph(networkGraphBuilder);
    defineNplGraph(nplGraphBuilder);
    definePipeGraph(pipeGraphBuilder);
    definePipeRouteGraph(pipeRouteGraphBuilder);
    defineProcessAcceptGraph(processAcceptGraphBuilder);
    defineProcessAwaitGraph(processAwaitGraphBuilder);
    defineProcessGraph(processGraphBuilder);
    defineProcessRouteGraph(processRouteGraphBuilder);
    defineRoutingStatementGraph(routingStatementGraphBuilder);
    defineSetGraph(setGraphBuilder);
    defineTestGraph(testGraphBuilder);
    defineUsingGraph(usingGraphBuilder);
    defineVarGraph(varGraphBuilder);

    nplGraphBuilder.checkIsBuilt();

    return nplGraph;
}
