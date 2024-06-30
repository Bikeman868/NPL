import { GraphBuilder } from '../stateMachine/GraphBuilder.js';
import { buildSymbolParser, skipSeparators } from '../stateMachine/SyntaxParser.js';

// prettier-ignore
export function defineBinaryOperatorGraph(builder: GraphBuilder) {
    builder.clear()
    .graph.start
        .transition(buildSymbolParser('==', 'Operator'), skipSeparators)
        .transition(buildSymbolParser('!=', 'Operator'), skipSeparators)
        .transition(buildSymbolParser('+', 'Operator'), skipSeparators)
        .transition(buildSymbolParser('-', 'Operator'), skipSeparators)
        .transition(buildSymbolParser('*', 'Operator'), skipSeparators)
        .transition(buildSymbolParser('/', 'Operator'), skipSeparators)
        .transition(buildSymbolParser('&&', 'Operator'), skipSeparators)
        .transition(buildSymbolParser('||', 'Operator'), skipSeparators)
        .transition(buildSymbolParser('&', 'Operator'), skipSeparators)
        .transition(buildSymbolParser('|', 'Operator'), skipSeparators)
        .transition(buildSymbolParser('>=', 'Operator'), skipSeparators)
        .transition(buildSymbolParser('<=', 'Operator'), skipSeparators)
        .transition(buildSymbolParser('>', 'Operator'), skipSeparators)
        .transition(buildSymbolParser('<', 'Operator'), skipSeparators)
        .transition(buildSymbolParser('.', 'Operator'), skipSeparators)
    .graph.build();
}
