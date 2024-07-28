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
    literalMessageGraphBuilder,
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
    awaitGraphBuilder,
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
    binaryOperatorGraphBuilder,
    expressionTermGraphBuilder,
    functionCallGraphBuilder,
    indexExpressionGraphBuilder,
    literalListGraphBuilder,
    literalMapGraphBuilder,
    subExpressionGraphBuilder,
    unaryOperatorGraphBuilder,
    messageJsonGraphBuilder,
    messageTypeSelectorGraphBuilder,
    captureGraphBuilder,
} from './index.js';

import { defineDataTypeGraph } from './syntaxGraphs/dataTypeGraph.js';
import { SyntaxGraph } from '#interfaces/SyntaxGraph.js';
import { defineApplicationConnectionGraph } from './syntaxGraphs/applicationConnectionGraph.js';
import { defineApplicationGraph } from './syntaxGraphs/applicationGraph.js';
import { defineCaptureGraph } from './syntaxGraphs/captureGraph.js';
import { defineConfigFieldGraph } from './syntaxGraphs/configFieldGraph.js';
import { defineConfigGraph } from './syntaxGraphs/configGraph.js';
import { defineConstGraph } from './syntaxGraphs/constGraph.js';
import { defineDestinationGraph } from './syntaxGraphs/destinationGraph.js';
import { defineDestinationListGraph } from './syntaxGraphs/destinationListGraph.js';
import { defineEmitGraph } from './syntaxGraphs/emitGraph.js';
import { defineEnumGraph } from './syntaxGraphs/enumGraph.js';
import { defineEolGraph } from './syntaxGraphs/eolGraph.js';
import { defineExpectGraph } from './syntaxGraphs/expectGraph.js';
import { defineMessageContextGraph } from './syntaxGraphs/messageContextGraph.js';
import { defineMessageDefinitionGraph } from './syntaxGraphs/messageDefinitionGraph.js';
import { defineMessageInitGraph } from './syntaxGraphs/messageInitGraph.js';
import { defineLiteralMessageGraph } from './syntaxGraphs/literalMessageGraph.js';
import { defineMessageMessageGraph } from './syntaxGraphs/messageMessageGraph.js';
import { defineAssignmentExpressionGraph } from './syntaxGraphs/assignmentExpressionGraph.js';
import { defineNamespaceGraph } from './syntaxGraphs/namespaceGraph.js';
import { defineNplGraph } from './syntaxGraphs/nplGraph.js';
import { definePipeGraph } from './syntaxGraphs/pipeGraph.js';
import { definePipeRouteGraph } from './syntaxGraphs/pipeRouteGraph.js';
import { defineProcessAcceptGraph } from './syntaxGraphs/processAcceptGraph.js';
import { defineAwaitGraph } from './syntaxGraphs/awaitGraph.js';
import { defineProcessGraph } from './syntaxGraphs/processGraph.js';
import { defineProcessRouteGraph } from './syntaxGraphs/processRouteGraph.js';
import { defineRoutingStatementGraph } from './syntaxGraphs/routingStatementGraph.js';
import { defineSetGraph } from './syntaxGraphs/setGraph.js';
import { defineTestGraph } from './syntaxGraphs/testGraph.js';
import { defineUsingGraph } from './syntaxGraphs/usingGraph.js';
import { defineVarGraph } from './syntaxGraphs/varGraph.js';
import { defineNetworkGraph } from './syntaxGraphs/networkGraph.js';
import { defineMessageRouteGraph } from './syntaxGraphs/messageRouteGraph.js';
import { defineBinaryOperatorGraph } from './syntaxGraphs/binaryOperatorGraph.js';
import { defineConditionalExpressionGraph } from './syntaxGraphs/conditionalExpressionGraph.js';
import { defineExpressionTermGraph } from './syntaxGraphs/expressionTermGraph.js';
import { defineFunctionCallGraph } from './syntaxGraphs/functionCallGraph.js';
import { defineIndexExpressionGraph } from './syntaxGraphs/indexExpressionGraph.js';
import { defineLiteralListGraph } from './syntaxGraphs/literalListGraph.js';
import { defineLiteralMapGraph } from './syntaxGraphs/literalMapGraph.js';
import { defineSubExpressionGraph } from './syntaxGraphs/subExpressionGraph.js';
import { defineUnaryOperatorGraph } from './syntaxGraphs/unaryOperatorGraph.js';
import { defineMessageJsonGraph } from './syntaxGraphs/messageJsonGraph.js';
import { defineMessageTypeSelectorGraph } from './syntaxGraphs/messageTypeSelectorGraph.js';

export function buildNplSyntaxGraph(): SyntaxGraph {
    defineApplicationConnectionGraph(applicationConnectionGraphBuilder);
    defineApplicationGraph(applicationGraphBuilder);
    defineAssignmentExpressionGraph(assignmentExpressionGraphBuilder);
    defineBinaryOperatorGraph(binaryOperatorGraphBuilder);
    defineCaptureGraph(captureGraphBuilder);
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
    defineExpressionTermGraph(expressionTermGraphBuilder);
    defineFunctionCallGraph(functionCallGraphBuilder);
    defineIndexExpressionGraph(indexExpressionGraphBuilder);
    defineLiteralListGraph(literalListGraphBuilder);
    defineLiteralMapGraph(literalMapGraphBuilder);
    defineMessageContextGraph(messageContextGraphBuilder);
    defineMessageDefinitionGraph(messageDefinitionGraphBuilder);
    defineMessageInitGraph(messageInitGraphBuilder);
    defineMessageJsonGraph(messageJsonGraphBuilder);
    defineLiteralMessageGraph(literalMessageGraphBuilder);
    defineMessageMessageGraph(messageMessageGraphBuilder);
    defineMessageRouteGraph(messageRouteGraphBuilder);
    defineMessageTypeSelectorGraph(messageTypeSelectorGraphBuilder);
    defineNamespaceGraph(namespaceGraphBuilder);
    defineNetworkGraph(networkGraphBuilder);
    defineNplGraph(nplGraphBuilder);
    definePipeGraph(pipeGraphBuilder);
    definePipeRouteGraph(pipeRouteGraphBuilder);
    defineProcessAcceptGraph(processAcceptGraphBuilder);
    defineAwaitGraph(awaitGraphBuilder);
    defineProcessGraph(processGraphBuilder);
    defineProcessRouteGraph(processRouteGraphBuilder);
    defineRoutingStatementGraph(routingStatementGraphBuilder);
    defineSetGraph(setGraphBuilder);
    defineSubExpressionGraph(subExpressionGraphBuilder);
    defineTestGraph(testGraphBuilder);
    defineUnaryOperatorGraph(unaryOperatorGraphBuilder);
    defineUsingGraph(usingGraphBuilder);
    defineVarGraph(varGraphBuilder);

    nplGraphBuilder.checkIsBuilt();

    return nplGraph;
}
