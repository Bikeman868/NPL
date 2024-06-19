import {
    openRoundBracket,
    closeRoundBracket,
    openCurlyBracket,
    comma,
    openSquareBracket,
    closeSquareBracket,
    closeCurlyBracket,
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
import { eolGraph } from './eolGraph.js';

const parseStartSubExpression = buildSymbolParser(openRoundBracket, 'StartSubExpression');
const parseEndSubExpression = buildSymbolParser(closeRoundBracket, 'EndSubExpression');
const parseStartListLiteral = buildSymbolParser(openSquareBracket, 'StartListLiteral');
const parseEndListLiteral = buildSymbolParser(closeSquareBracket, 'EndListLiteral');
const parseStartIndexer = buildSymbolParser(openSquareBracket, 'StartIndexer');
const parseEndIndexer = buildSymbolParser(closeSquareBracket, 'EndIndexer');
const parseStartFunctionCall = buildSymbolParser(openRoundBracket, 'StartCallParams');
const parseEndFunctionCall = buildSymbolParser(closeRoundBracket, 'EndCallParams');

const termGraphBuilder = new GraphBuilder('expression-term');
const binaryOperatorGraphBuilder = new GraphBuilder('binary-operator');
const unaryOperatorGraphBuilder = new GraphBuilder('unary-operator');
const closeTerminatedExpressionGraphBuilder = new GraphBuilder('close-terminated-expression');
const expressionGraphBuilder = new GraphBuilder('eol-terminated-expression');
const conditionalExpressionGraphBuilder = new GraphBuilder('conditional-expression');
const parameterExpressionGraphBuilder = new GraphBuilder('parameter-expression');
const indexExpressionGraphBuilder = new GraphBuilder('array-index-expression');
const functionCallGraphBuilder = new GraphBuilder('function-call');

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
termGraphBuilder
    .graph.start
        .transition('string literal', parseString, skipSeparators)
        .transition('number literal', parseNumber, skipSeparators)
        .transition('boolean literal', parseBoolean, skipSeparators)
        .transition('date literal', parseString, skipSeparators)
        .transition('identifier', parseQualifiedIdentifier, skipSeparators)
        .transition(openRoundBracket, parseStartSubExpression, skipSeparators, 'sub-expression')
        .transition(openSquareBracket, parseStartListLiteral, skipSeparators, 'literal-list')
        .subGraph('unary', unaryOperatorGraphBuilder.build(), 'unary')
    .graph.state('sub-expression')
        .subGraph('sub-expression', closeTerminatedExpressionGraphBuilder.build())
    .graph.state('literal-list')
        .transition(closeSquareBracket, parseEndListLiteral, skipSeparators)
        .subGraph('list-blank-line', eolGraph, 'literal-list')
        .subGraph('list-element', expressionGraphBuilder.build(), 'literal-list')
    .graph.state('unary')
        .transition('string literal', parseString, skipSeparators)
        .transition('number literal', parseNumber, skipSeparators)
        .transition('boolean literal', parseBoolean, skipSeparators)
        .transition('date literal', parseString, skipSeparators)
        .transition('identifier', parseQualifiedIdentifier, skipSeparators)
        .transition(openRoundBracket, parseStartSubExpression, skipSeparators, 'sub-expression')
        .transition(openSquareBracket, parseStartListLiteral, skipSeparators, 'literal-list')
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
    .graph.build();

// prettier-ignore
/* Examples 

    'hello' + ', ' + 'world')

    myArray[10])

*/
closeTerminatedExpressionGraphBuilder
    .graph.start
        .subGraph('term', termGraphBuilder.build(), 'operator')
    .graph.state('operator')
        .transition(closeRoundBracket, parseEndSubExpression, skipSeparators)
        .subGraph('operator', binaryOperatorGraphBuilder.build(), 'second-term')
        .subGraph('indexer', indexExpressionGraphBuilder.build(), 'operator')
        .subGraph('function-call', functionCallGraphBuilder.build(), 'operator')
    .graph.state('second-term')
        .subGraph('second-term', termGraphBuilder.build(), 'operator')
    .graph.build();

// prettier-ignore
/* Examples

    [21]

    [i + 1]

    [list[3]]

*/
indexExpressionGraphBuilder
    .graph.start
        .transition(openSquareBracket, parseStartIndexer, skipSeparators, 'index-expression')
    .graph.state('index-expression')
        .subGraph('term', termGraphBuilder.build(), 'operator')
    .graph.state('operator')
        .transition(closeSquareBracket, parseEndIndexer, skipSeparators)
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
        .transition(openRoundBracket, parseStartFunctionCall, skipSeparators, 'parameter')
    .graph.state('parameter')
        .transition(closeRoundBracket, parseEndFunctionCall, skipSeparators)
        .subGraph('term', termGraphBuilder.build(), 'operator')
    .graph.state('operator')
        .transition(closeRoundBracket, parseEndFunctionCall, skipSeparators)
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
export const expressionGraph = expressionGraphBuilder
    .graph.start
        .subGraph('term', termGraphBuilder.build(), 'operator')
    .graph.state('operator')
        .subGraph('end', eolGraph)
        .subGraph('operator', binaryOperatorGraphBuilder.build(), 'second-term')
        .subGraph('indexer', indexExpressionGraphBuilder.build(), 'operator')
        .subGraph('function-call', functionCallGraphBuilder.build(), 'operator')
    .graph.state('second-term')
        .subGraph('second-term', termGraphBuilder.build(), 'operator')
    .graph.build();

// prettier-ignore
/* Examples

    'String literal' {

    123.56 {

    (1 + 2) * (5 + 6) {

*/
export const conditionalExpressionGraph = conditionalExpressionGraphBuilder
    .graph.start
        .subGraph('term', termGraphBuilder.build(), 'operator')
    .graph.state('operator')
        .transition(openCurlyBracket, buildSymbolParser(openCurlyBracket, 'StartScope'), skipSeparators)
        .subGraph('operator', binaryOperatorGraphBuilder.build(), 'second-term')
        .subGraph('indexer', indexExpressionGraphBuilder.build(), 'operator')
        .subGraph('function-call', functionCallGraphBuilder.build(), 'operator')
    .graph.state('second-term')
        .subGraph('second-term', termGraphBuilder.build(), 'operator')
    .graph.build();
