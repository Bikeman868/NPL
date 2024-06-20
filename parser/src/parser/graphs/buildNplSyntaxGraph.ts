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
    expressionGraphBuilder,
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
} from "./index.js";

import { buildDataTypeGraph } from "./dataTypeGraph.js";
import { SyntaxGraph } from "#interfaces/SyntaxGraph.js";
import { defineApplicationConnectionGraph } from "./applicationConnectionGraph.js";
import { defineApplicationGraph } from "./applicationGraph.js";
import { defineConfigFieldGraph } from "./configFieldGraph.js";
import { defineConfigGraph } from "./configGraph.js";
import { defineConstGraph } from "./constGraph.js";
import { defineDestinationGraph } from "./destinationGraph.js";
import { defineDestinationListGraph } from "./destinationListGraph.js";
import { defineEmitGraph } from "./emitGraph.js";
import { defineEnumGraph } from "./enumGraph.js";
import { defineEolGraph } from "./eolGraph.js";
import { defineExpectGraph } from "./expectGraph.js";
import { defineMessageContextGraph } from "./messageContextGraph.js";
import { defineMessageDefinitionGraph } from "./messageDefinitionGraph.js";
import { defineMessageInitGraph } from "./messageInitGraph.js";
import { defineMessageLiteralGraph } from "./messageLiteralGraph.js";
import { defineMessageMessageGraph } from "./messageMessageGraph.js";
import { defineConditionalExpressionGraph, defineExpressionGraph } from "./expressionGraph.js";
import { defineNamespaceGraph } from "./namespaceGraph.js";
import { defineNplGraph } from "./nplGraph.js";
import { definePipeGraph } from "./pipeGraph.js";
import { definePipeRouteGraph } from "./pipeRouteGraph.js";
import { defineProcessAcceptGraph } from "./processAcceptGraph.js";
import { defineProcessAwaitGraph } from "./processAwaitGraph.js";
import { defineProcessGraph } from "./processGraph.js";
import { defineProcessRouteGraph } from "./processRouteGraph.js";
import { defineRoutingStatementGraph } from "./routingStatementGraph.js";
import { defineSetGraph } from "./setGraph.js";
import { defineTestGraph } from "./testGraph.js";
import { defineUsingGraph } from "./usingGraph.js";
import { defineVarGraph } from "./varGraph.js";

export function buildNplSyntaxGraph(): SyntaxGraph {
    defineApplicationConnectionGraph(applicationConnectionGraphBuilder);
    defineApplicationGraph(applicationGraphBuilder);
    defineConfigFieldGraph(configFieldGraphBuilder);
    defineConfigGraph(configGraphBuilder);
    defineConstGraph(constGraphBuilder);
    buildDataTypeGraph(dataTypeGraphBuilder)
    defineDestinationGraph(destinationGraphBuilder);
    defineDestinationListGraph(destinationListGraphBuilder);
    defineEmitGraph(emitGraphBuilder);
    defineEnumGraph(enumGraphBuilder);
    defineEolGraph(eolGraphBuilder);
    defineExpectGraph(expectGraphBuilder);
    defineExpressionGraph(expressionGraphBuilder);
    defineConditionalExpressionGraph(conditionalExpressionGraphBuilder);
    defineMessageContextGraph(messageContextGraphBuilder);
    defineMessageDefinitionGraph(messageDefinitionGraphBuilder);
    defineMessageInitGraph(messageInitGraphBuilder);
    defineMessageLiteralGraph(messageLiteralGraphBuilder);
    defineMessageMessageGraph(messageMessageGraphBuilder);
    defineNamespaceGraph(namespaceGraphBuilder);
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

    return nplGraph;
}