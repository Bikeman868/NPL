import { SyntaxParser, WhitespaceSkipper } from './SyntaxParser';
import { Graph } from './Graph.js';
import { State } from './State.js';
import { SubGraphTransition } from './SubGraphTransition.js';

export class GraphBuilder {
    private _graph: Graph;

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

    state(name: string): GraphStateBuilder {
        if (this._graph.states.get(name))
            throw Error(`There are two ${name} states in the ${this._graph.start.name} graph`);

        const stateBuilder = new GraphStateBuilder(this, name);
        this._graph.states.set(name, stateBuilder.build());
        return stateBuilder;
    }

    get graph(): GraphBuilder {
        return this;
    }

    get start(): GraphStartBuilder {
        return new GraphStartBuilder(this);
    }

    build(): Graph {
        return this._graph;
    }

    startTransition(
        description: string,
        parser: SyntaxParser,
        whitespaceSkipper?: WhitespaceSkipper,
        nextStateName?: string,
    ): GraphBuilder {
        this._graph.start.transitions.push({
            description,
            nextStateName,
            parser,
            whitespaceSkipper,
        });
        return this;
    }

    startSubGraph(name: string, graph: Graph, nextStateName?: string): GraphBuilder {
        this.defineSubGraph(name, graph, nextStateName);
        this._graph.start.subGraphNames.push(name);
        return this;
    }

    defineSubGraph(name: string, graph: Graph, nextStateName?: string) {
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

    transition(
        description: string,
        parser: SyntaxParser,
        whitespaceSkipper?: WhitespaceSkipper,
        nextStateName?: string,
    ): GraphStartBuilder {
        this._graphBuilder.startTransition(description, parser, whitespaceSkipper, nextStateName);
        return this;
    }

    get graph(): GraphBuilder {
        return this._graphBuilder;
    }

    subGraph(name: string, graph: Graph, nextStateName?: string): GraphStartBuilder {
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

    transition(
        description: string,
        parser: SyntaxParser,
        whitespaceSkipper?: WhitespaceSkipper,
        nextStateName?: string,
    ): GraphStateBuilder {
        this._state.transitions.push({
            description,
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

    subGraph(name: string, graph: Graph, nextStateName?: string): GraphStateBuilder {
        this._graphBuilder.defineSubGraph(name, graph, nextStateName);
        this._state.subGraphNames.push(name);
        return this;
    }
}
