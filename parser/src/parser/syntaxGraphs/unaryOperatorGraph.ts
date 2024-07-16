import { parseNotOperator, parseSpreadOperator } from '#parser/index.js';
import { GraphBuilder } from '../stateMachine/GraphBuilder.js';
import { buildSymbolParser, skipSeparators } from '../stateMachine/SyntaxParser.js';

// prettier-ignore
export function defineUnaryOperatorGraph(builder: GraphBuilder) {
    builder.clear()
    .graph.start
        .transition(parseNotOperator, skipSeparators)
        .transition(parseSpreadOperator, skipSeparators)
    .graph.build();
}
