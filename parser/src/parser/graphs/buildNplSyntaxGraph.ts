import { dataTypeGraphBuilder } from "./index.js";
import { buildDataTypeGraph } from "./dataTypeGraph.js";
import { nplGraph } from "./nplGraph.js";
import { SyntaxGraph } from "#interfaces/SyntaxGraph.js";

export function buildNplSyntaxGraph(): SyntaxGraph {
    buildDataTypeGraph(dataTypeGraphBuilder)

    return nplGraph;
}