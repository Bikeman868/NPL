import { State } from '#interfaces/State.js';
import { SubGraphTransition } from '#interfaces/SubGraphTransition.js';
import { SyntaxGraph } from '#interfaces/SyntaxGraph.js';
import { SyntaxParser } from '#interfaces/SyntaxParser.js';
import { WhitespaceSkipper } from 'syntax.js';

export class GraphBuilder {
    private _graph: SyntaxGraph;

    constructor(name: string) {
        this._graph = {
            start: {
                name: name,
                subGraphNames: [],
                transitions: [],
            },
            states: new Map<string, State>(),
            subGraphs: new Map<string, SubGraphTransition>([]),
        };
    }

    clear(): GraphBuilder {
        this._graph.start = {
            name: this._graph.start.name,
            subGraphNames: [],
            transitions: [],
        };
        this._graph.states = new Map<string, State>();
        this._graph.subGraphs = new Map<string, SubGraphTransition>([]);
        return this;
    }

    state(name: string): GraphStateBuilder {
        if (this._graph.states.get(name))
            throw Error(`There are two ${name} states in the ${this._graph.start.name} graph`);

        const stateBuilder = new GraphStateBuilder(this, name);
        this._graph.states.set(name, stateBuilder.build());
        return stateBuilder;
    }

    private _checkIsGraphBuilt(graph: SyntaxGraph, visited: Set<SyntaxGraph>): void {
        if (visited.has(graph)) return;
        visited.add(graph);

        if (!graph.start.subGraphNames || graph.start.subGraphNames.length == 0) {
            if (!graph.start.transitions || graph.start.transitions.length == 0)
                throw Error(`The ${graph.start.name} graph has no start sub-graphs or start transitions`);
        }

        for (let subGraph of graph.subGraphs) {
            const subGraphTranstion = subGraph[1];
            if (!subGraphTranstion || !subGraphTranstion.graph)
                throw Error(`The ${subGraph[0]} sub-graph of the ${graph.start.name} graph is undefined`);
            this._checkIsGraphBuilt(subGraphTranstion.graph, visited);
        }
    }

    checkIsBuilt(): void {
        const checkedGraphs = new Set<SyntaxGraph>();
        try {
            this._checkIsGraphBuilt(this._graph, checkedGraphs);
        } catch (e) {
            console.error(e);
        }
    }

    get graph(): GraphBuilder {
        return this;
    }

    get start(): GraphStartBuilder {
        return new GraphStartBuilder(this);
    }

    build(): SyntaxGraph {
        return this._graph;
    }

    startTransition(parser: SyntaxParser, whitespaceSkipper?: WhitespaceSkipper, nextStateName?: string): GraphBuilder {
        this._graph.start.transitions.push({
            nextStateName,
            parser,
            whitespaceSkipper,
        });
        return this;
    }

    startSubGraph(name: string, graph: SyntaxGraph, nextStateName?: string): GraphBuilder {
        this.defineSubGraph(name, graph, nextStateName);
        this._graph.start.subGraphNames.push(name);
        return this;
    }

    defineSubGraph(name: string, graph: SyntaxGraph, nextStateName?: string) {
        if (this._graph.subGraphs.get(name))
            throw Error(`There are two ${name} sub-graphs in the ${this._graph.start.name} graph`);

        this._graph.subGraphs.set(name, {
            graph,
            nextStateName,
        });
    }
}

export class GraphStartBuilder {
    private _graphBuilder: GraphBuilder;

    constructor(graphBuilder: GraphBuilder) {
        this._graphBuilder = graphBuilder;
    }

    transition(parser: SyntaxParser, whitespaceSkipper?: WhitespaceSkipper, nextStateName?: string): GraphStartBuilder {
        this._graphBuilder.startTransition(parser, whitespaceSkipper, nextStateName);
        return this;
    }

    get graph(): GraphBuilder {
        return this._graphBuilder;
    }

    subGraph(name: string, graph: SyntaxGraph, nextStateName?: string): GraphStartBuilder {
        this._graphBuilder.startSubGraph(name, graph, nextStateName);
        return this;
    }
}

export class GraphStateBuilder {
    private _graphBuilder: GraphBuilder;
    private _state: State;

    constructor(graphBuilder: GraphBuilder, name: string) {
        this._graphBuilder = graphBuilder;
        this._state = {
            name,
            subGraphNames: [],
            transitions: [],
        };
    }

    transition(parser: SyntaxParser, whitespaceSkipper?: WhitespaceSkipper, nextStateName?: string): GraphStateBuilder {
        this._state.transitions.push({
            parser,
            whitespaceSkipper,
            nextStateName,
        });
        return this;
    }

    get graph(): GraphBuilder {
        return this._graphBuilder;
    }

    build(): State {
        return this._state;
    }

    subGraph(name: string, graph: SyntaxGraph, nextStateName?: string): GraphStateBuilder {
        this._graphBuilder.defineSubGraph(name, graph, nextStateName);
        this._state.subGraphNames.push(name);
        return this;
    }
}
