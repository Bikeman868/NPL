import { openCurlyBracket, comma } from '#interfaces/charsets.js';
import { GraphBuilder } from '../stateMachine/GraphBuilder.js';
import {
    buildSymbolParser,
    parseBoolean,
    parseIdentifier,
    parseNumber,
    parseQualifiedIdentifier,
    parseString,
    skipSeparators,
} from '../stateMachine/SyntaxParser.js';
import {
    assignmentExpressionGraph,
    binaryOperatorGraph,
    eolGraph,
    expressionTermGraph,
    functionCallGraph,
    indexExpressionGraph,
    literalListGraph,
    literalListGraphBuilder,
    literalMapGraph,
    literalMapGraphBuilder,
    messageConstructorGraph,
    parseEndFunctionCallSymbol,
    parseEndIndexerSymbol,
    parseEndListLiteralSymbol,
    parseEndMapLiteralSymbol,
    parseEndSubExpressionSymbol,
    parseStartFunctionCallSymbol,
    parseStartIndexerSymbol,
    parseStartListLiteralSymbol,
    parseStartMapLiteralSymbol,
    parseStartSubExpressionSymbol,
    subExpressionGraph,
    subExpressionGraphBuilder,
    unaryOperatorGraph,
    unaryOperatorGraphBuilder,
} from '../index.js';

// prettier-ignore
/* Examples:

    'hello, world'

    [
        1 
        2 
        3
    ]

    namespace1.LogOption.debug

    !namespace1.LogOption.debug

    true

    (<expression>)

    {
        key1 value1
        key2 value2
    }

*/
export function defineExpressionTermGraph(builder: GraphBuilder) {
    builder.clear()
    .graph.start
        .transition(parseString, skipSeparators)
        .transition(parseNumber, skipSeparators)
        .transition(parseBoolean, skipSeparators)
        .transition(parseString, skipSeparators)
        .transition(parseQualifiedIdentifier, skipSeparators)
        .subGraph('literal-list', literalListGraph)
        .subGraph('literal-map', literalMapGraph)
        .subGraph('sub-expression', subExpressionGraph)
        .subGraph('unary', unaryOperatorGraph, 'unary')
    .graph.state('unary')
        .transition(parseString, skipSeparators)
        .transition(parseNumber, skipSeparators)
        .transition(parseBoolean, skipSeparators)
        .transition(parseString, skipSeparators)
        .transition(parseQualifiedIdentifier, skipSeparators)
        .subGraph('unary-literal-list', literalListGraphBuilder.build())
        .subGraph('unary-literal-map', literalMapGraphBuilder.build())
        .subGraph('unary-sub-expression', subExpressionGraphBuilder.build())
        .subGraph('double-unary', unaryOperatorGraphBuilder.build(), 'unary')
    .graph.build();
}

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

// prettier-ignore
export function defineUnaryOperatorGraph(builder: GraphBuilder) {
    builder.clear()
    .graph.start
        .transition(buildSymbolParser('!', 'Operator'), skipSeparators)
        .transition(buildSymbolParser('...', 'Operator'), skipSeparators)
    .graph.build();
}

// prettier-ignore
/* Examples 

    [ 'hello'
      'world'
    ]

    []

*/
export function defineLiteralListGraph(builder: GraphBuilder) {
    builder.clear()
    .graph.start
        .transition(parseStartMapLiteralSymbol, skipSeparators, 'elements')
    .graph.state('elements')
        .transition(parseEndMapLiteralSymbol, skipSeparators)
        .subGraph('list-blank-line', eolGraph, 'elements')
        .subGraph('list-element', assignmentExpressionGraph, 'elements')
    .graph.build();
}

// prettier-ignore
/* Examples 

    {
        'key1' 1
        'key2' 2
    }

    {}

*/
export function defineLiteralMapGraph(builder: GraphBuilder) {
    builder.clear()
    .graph.start
        .transition(parseStartMapLiteralSymbol, skipSeparators, 'entries')
    .graph.state('entries')
        .transition(parseEndMapLiteralSymbol, skipSeparators)
        .transition(parseIdentifier, skipSeparators, 'value')
        .subGraph('blank-line', eolGraph, 'entries')
    .graph.state('value')
        .subGraph('value', assignmentExpressionGraph, 'entries')
    .graph.build();
}

// prettier-ignore
/* Examples 

    ('hello' + ', ' + 'world')

    (myArray[10])

*/
export function defineSubExpressionGraph(builder: GraphBuilder) {
    builder.clear()
    .graph.start
        .transition(parseStartSubExpressionSymbol, skipSeparators, 'term')
    .graph.state('term')
        .transition(parseEndSubExpressionSymbol, skipSeparators)
        .subGraph('term', expressionTermGraph, 'operator')
    .graph.state('operator')
        .transition(parseEndSubExpressionSymbol, skipSeparators)
        .subGraph('operator', binaryOperatorGraph, 'second-term')
        .subGraph('indexer', indexExpressionGraph, 'operator')
        .subGraph('function-call', functionCallGraph, 'operator')
    .graph.state('second-term')
        .subGraph('second-term', expressionTermGraph, 'operator')
    .graph.build();
}

// prettier-ignore
/* Examples

    [21]

    [i + 1]

    [list[3]]

*/
export function defineIndexExpressionGraph(builder: GraphBuilder) {
    builder.clear()
    .graph.start
        .transition(parseStartIndexerSymbol, skipSeparators, 'index-expression')
    .graph.state('index-expression')
        .subGraph('term', expressionTermGraph, 'operator')
    .graph.state('operator')
        .transition(parseEndIndexerSymbol, skipSeparators)
        .subGraph('operator', binaryOperatorGraph, 'index-expression')
        .subGraph('indexer', indexExpressionGraph, 'operator')
        .subGraph('function-call', functionCallGraph, 'operator')
    .graph.build();
}

// prettier-ignore
/* Examples

    (1, 2, 3)

    (list[3], myString.indexOf(' '), 99)

*/
export function defineFunctionCallGraph(builder: GraphBuilder) {
    builder.clear()
    .graph.start
        .transition(parseStartFunctionCallSymbol, skipSeparators, 'parameter')
    .graph.state('parameter')
        .transition(parseEndFunctionCallSymbol, skipSeparators)
        .subGraph('term', expressionTermGraph, 'operator')
    .graph.state('operator')
        .transition(parseEndFunctionCallSymbol, skipSeparators)
        .transition(buildSymbolParser(comma, 'ListSeparator'), skipSeparators, 'parameter')
        .subGraph('operator', binaryOperatorGraph, 'parameter')
        .subGraph('indexer', indexExpressionGraph, 'operator')
        .subGraph('function-call', functionCallGraph, 'operator')
    .graph.build();
}

// prettier-ignore
/* Examples

    'String literal'<EOL>

    123.56<EOL>

    (1 + 2) * (5 + 6)<EOL>

    myArray[10]<EOL>

    ['one'
     'two'
     'three'
    ][index]<EOL>

    myMessage { 
        message id 1
    }<EOL>

    MessageType {
        message {
            field1 field1Value
            field2 field2Value
        }
    }<EOL>

*/
export function defineAssignmentExpressionGraph(builder: GraphBuilder) {
    builder.clear()
    .graph.start
        .subGraph('term', expressionTermGraph, 'operator')
    .graph.state('operator')
        .subGraph('end', eolGraph)
        .subGraph('operator', binaryOperatorGraph, 'second-term')
        .subGraph('indexer', indexExpressionGraph, 'operator')
        .subGraph('function-call', functionCallGraph, 'operator')
        .subGraph('message-literal', messageConstructorGraph, 'operator')
    .graph.state('second-term')
        .subGraph('second-term', expressionTermGraph, 'operator')
    .graph.build();
}

// prettier-ignore
/* Examples

    'String literal' {

    123.56 {

    (1 + 2) * (5 + 6) {

*/
export function defineConditionalExpressionGraph(builder: GraphBuilder) {
    builder.clear()
    .graph.start
        .subGraph('term', expressionTermGraph, 'operator')
    .graph.state('operator')
        .transition(buildSymbolParser(openCurlyBracket, 'StartScope'), skipSeparators)
        .subGraph('operator', binaryOperatorGraph, 'second-term')
        .subGraph('indexer', indexExpressionGraph, 'operator')
        .subGraph('function-call', functionCallGraph, 'operator')
    .graph.state('second-term')
        .subGraph('second-term', expressionTermGraph, 'operator')
    .graph.build();
}
