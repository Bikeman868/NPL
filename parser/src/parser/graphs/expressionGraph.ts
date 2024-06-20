import {
    openRoundBracket,
    closeRoundBracket,
    openCurlyBracket,
    comma,
    openSquareBracket,
    closeSquareBracket,
} from '#interfaces/charsets.js';
import { GraphBuilder } from '../stateMachine/GraphBuilder.js';
import {
    buildSymbolParser,
    parseBoolean,
    parseNumber,
    parseQualifiedIdentifier,
    parseString,
    skipSeparators,
} from '../stateMachine/SyntaxParser.js';
import {
    assignmentExpressionGraph,
    eolGraph,
    parseEndFunctionCallSymbol,
    parseEndIndexerSymbol,
    parseEndListLiteralSymbol,
    parseEndSubExpressionSymbol,
    parseStartFunctionCallSymbol,
    parseStartIndexerSymbol,
    parseStartListLiteralSymbol,
    parseStartSubExpressionSymbol,
} from './index.js';

const expressionTermGraphBuilder = new GraphBuilder('expression-term');
const binaryOperatorGraphBuilder = new GraphBuilder('binary-operator');
const unaryOperatorGraphBuilder = new GraphBuilder('unary-operator');
const subExpressionGraphBuilder = new GraphBuilder('close-terminated-expression');
const indexExpressionGraphBuilder = new GraphBuilder('array-index-expression');
const functionCallGraphBuilder = new GraphBuilder('function-call');
const literalListGraphBuilder = new GraphBuilder('literal-list');

// prettier-ignore
/* Examples:

    'hello, world'

    [
        1 
        2 
        3
    ]

    namespace1.LogOption.debug

    true

    (<expression>)

*/
expressionTermGraphBuilder
    .graph.start
        .transition('string literal', parseString, skipSeparators)
        .transition('number literal', parseNumber, skipSeparators)
        .transition('boolean literal', parseBoolean, skipSeparators)
        .transition('date literal', parseString, skipSeparators)
        .transition('identifier', parseQualifiedIdentifier, skipSeparators)
        .subGraph('literal-list', literalListGraphBuilder.build())
        .subGraph('sub-expression', subExpressionGraphBuilder.build())
        .subGraph('unary', unaryOperatorGraphBuilder.build(), 'unary')
    .graph.state('unary')
        .transition('string literal', parseString, skipSeparators)
        .transition('number literal', parseNumber, skipSeparators)
        .transition('boolean literal', parseBoolean, skipSeparators)
        .transition('date literal', parseString, skipSeparators)
        .transition('identifier', parseQualifiedIdentifier, skipSeparators)
        .subGraph('unary-literal-list', literalListGraphBuilder.build())
        .subGraph('unary-sub-expression', subExpressionGraphBuilder.build())
        .subGraph('double-unary', unaryOperatorGraphBuilder.build(), 'unary')
.graph.build();

// prettier-ignore
binaryOperatorGraphBuilder
    .graph.start
        .transition('==', buildSymbolParser('==', 'Operator'), skipSeparators)
        .transition('!=', buildSymbolParser('!=', 'Operator'), skipSeparators)
        .transition('+', buildSymbolParser('+', 'Operator'), skipSeparators)
        .transition('-', buildSymbolParser('-', 'Operator'), skipSeparators)
        .transition('*', buildSymbolParser('*', 'Operator'), skipSeparators)
        .transition('/', buildSymbolParser('/', 'Operator'), skipSeparators)
        .transition('&&', buildSymbolParser('&&', 'Operator'), skipSeparators)
        .transition('||', buildSymbolParser('||', 'Operator'), skipSeparators)
        .transition('&', buildSymbolParser('&', 'Operator'), skipSeparators)
        .transition('|', buildSymbolParser('|', 'Operator'), skipSeparators)
    .graph.build();

// prettier-ignore
unaryOperatorGraphBuilder
    .graph.start
        .transition('!', buildSymbolParser('!', 'Operator'), skipSeparators)
        .transition('...', buildSymbolParser('...', 'Operator'), skipSeparators)
    .graph.build();

// prettier-ignore
/* Examples 

    [ 'hello'
      'world'
    ]

    []

*/
literalListGraphBuilder
    .graph.start
        .transition(openSquareBracket, parseStartListLiteralSymbol, skipSeparators, 'elements')
    .graph.state('elements')
        .transition(closeSquareBracket, parseEndListLiteralSymbol, skipSeparators)
        .subGraph('list-blank-line', eolGraph, 'elements')
        .subGraph('list-element', assignmentExpressionGraph, 'elements')
    .graph.build();

// prettier-ignore
/* Examples 

    ('hello' + ', ' + 'world')

    (myArray[10])

*/
subExpressionGraphBuilder
    .graph.start
        .transition(openRoundBracket, parseStartSubExpressionSymbol, skipSeparators, 'term')
    .graph.state('term')
        .transition(closeRoundBracket, parseEndSubExpressionSymbol, skipSeparators)
        .subGraph('term', expressionTermGraphBuilder.build(), 'operator')
    .graph.state('operator')
        .transition(closeRoundBracket, parseEndSubExpressionSymbol, skipSeparators)
        .subGraph('operator', binaryOperatorGraphBuilder.build(), 'second-term')
        .subGraph('indexer', indexExpressionGraphBuilder.build(), 'operator')
        .subGraph('function-call', functionCallGraphBuilder.build(), 'operator')
    .graph.state('second-term')
        .subGraph('second-term', expressionTermGraphBuilder.build(), 'operator')
    .graph.build();

// prettier-ignore
/* Examples

    [21]

    [i + 1]

    [list[3]]

*/
indexExpressionGraphBuilder
    .graph.start
        .transition(openSquareBracket, parseStartIndexerSymbol, skipSeparators, 'index-expression')
    .graph.state('index-expression')
        .subGraph('term', expressionTermGraphBuilder.build(), 'operator')
    .graph.state('operator')
        .transition(closeSquareBracket, parseEndIndexerSymbol, skipSeparators)
        .subGraph('operator', binaryOperatorGraphBuilder.build(), 'index-expression')
        .subGraph('indexer', indexExpressionGraphBuilder.build(), 'operator')
        .subGraph('function-call', functionCallGraphBuilder.build(), 'operator')
    .graph.build();

// prettier-ignore
/* Examples

    (1, 2, 3)

    (list[3], myString.indexOf(' '), 99)

*/
functionCallGraphBuilder
    .graph.start
        .transition(openRoundBracket, parseStartFunctionCallSymbol, skipSeparators, 'parameter')
    .graph.state('parameter')
        .transition(closeRoundBracket, parseEndFunctionCallSymbol, skipSeparators)
        .subGraph('term', expressionTermGraphBuilder.build(), 'operator')
    .graph.state('operator')
        .transition(closeRoundBracket, parseEndFunctionCallSymbol, skipSeparators)
        .transition(comma, buildSymbolParser(comma, 'ListSeparator'), skipSeparators, 'parameter')
        .subGraph('operator', binaryOperatorGraphBuilder.build(), 'parameter')
        .subGraph('indexer', indexExpressionGraphBuilder.build(), 'operator')
        .subGraph('function-call', functionCallGraphBuilder.build(), 'operator')
    .graph.build();

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
        .subGraph('term', expressionTermGraphBuilder.build(), 'operator')
    .graph.state('operator')
        .subGraph('end', eolGraph)
        .subGraph('operator', binaryOperatorGraphBuilder.build(), 'second-term')
        .subGraph('indexer', indexExpressionGraphBuilder.build(), 'operator')
        .subGraph('function-call', functionCallGraphBuilder.build(), 'operator')
    .graph.state('second-term')
        .subGraph('second-term', expressionTermGraphBuilder.build(), 'operator')
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
        .subGraph('term', expressionTermGraphBuilder.build(), 'operator')
    .graph.state('operator')
        .transition(openCurlyBracket, buildSymbolParser(openCurlyBracket, 'StartScope'), skipSeparators)
        .subGraph('operator', binaryOperatorGraphBuilder.build(), 'second-term')
        .subGraph('indexer', indexExpressionGraphBuilder.build(), 'operator')
        .subGraph('function-call', functionCallGraphBuilder.build(), 'operator')
    .graph.state('second-term')
        .subGraph('second-term', expressionTermGraphBuilder.build(), 'operator')
    .graph.build();
}
