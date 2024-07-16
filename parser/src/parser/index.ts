import { buildKeywordParser, buildSymbolParser } from './stateMachine/SyntaxParser.js';
import { GraphBuilder } from './stateMachine/GraphBuilder.js';
import {
    closeCurlyBracket,
    closeRoundBracket,
    closeSquareBracket,
    exclamation,
    openCurlyBracket,
    openRoundBracket,
    openSquareBracket,
    trippleDot,
} from '#interfaces/charsets.js';

/* 
    This source file defines all of the syntax graphs used by the parser
    so that the graphs can reference each other without circular references
    in cases where the syntax is recursively nested
*/

export const parseAnyMessageTypeKeyword = buildSymbolParser('*', 'Keyword');
export const parseAcceptKeyword = buildKeywordParser(['accept'], 'Keyword');
export const parseApplicationKeyword = buildKeywordParser(['application'], 'Keyword');
export const parseAwaitKeyword = buildKeywordParser(['await'], 'Keyword');
export const parseCaptureKeyword = buildKeywordParser(['capture'], 'Keyword');
export const parseClearKeyword = buildKeywordParser(['clear'], 'Keyword');
export const parseConditionalKeyword = buildKeywordParser(['if', 'elseif', 'while'], 'Keyword');
export const parseConstKeyword = buildKeywordParser(['const'], 'Keyword');
export const parseDefaultKeyword = buildKeywordParser(['default'], 'Keyword');
export const parseDestinationKeyword = buildKeywordParser(['network', 'process', 'pipe'], 'Keyword');
export const parseEgressKeyword = buildKeywordParser(['egress'], 'Keyword');
export const parseElseKeyword = buildKeywordParser(['else'], 'Keyword');
export const parseEmitKeyword = buildKeywordParser(['emit'], 'Keyword');
export const parseEmptyKeyword = buildKeywordParser(['empty'], 'Keyword');
export const parseEnumKeyword = buildKeywordParser(['enum'], 'Keyword');
export const parseExpectKeyword = buildKeywordParser(['expect'], 'Keyword');
export const parseForKeyword = buildKeywordParser(['for'], 'Keyword');
export const parseForOfInKeyword = buildKeywordParser(['of', 'in'], 'Keyword');
export const parseIngressKeyword = buildKeywordParser(['ingress'], 'Keyword');
export const parseNetworkKeyword = buildKeywordParser(['network'], 'Keyword');
export const parsePipeKeyword = buildKeywordParser(['pipe'], 'Keyword');
export const parseRouteKeyword = buildKeywordParser(['route'], 'Keyword');
export const parseRouteEndKeyword = buildKeywordParser(['append', 'prepend', 'remove'], 'Keyword');
export const parseSetKeyword = buildKeywordParser(['set'], 'Keyword');
export const parseUsingKeyword = buildKeywordParser(['using'], 'Keyword');
export const parseVarKeyword = buildKeywordParser(['var'], 'Keyword');
export const parseMessageKeyword = buildKeywordParser(['message'], 'Keyword');
export const parseJsonKeyword = buildKeywordParser(['json'], 'Keyword');
export const parseBreakKeyword = buildKeywordParser(['break'], 'Keyword');
export const parseConnectionKeyword = buildKeywordParser(['connection'], 'Keyword');
export const parseMessageFieldQualifierKeyword = buildKeywordParser(['new', 'deprecated'], 'Keyword');

export const parseStartSubExpressionSymbol = buildSymbolParser(openRoundBracket, 'StartSubExpression');
export const parseEndSubExpressionSymbol = buildSymbolParser(closeRoundBracket, 'EndSubExpression');
export const parseStartListLiteralSymbol = buildSymbolParser(openSquareBracket, 'StartListLiteral');
export const parseEndListLiteralSymbol = buildSymbolParser(closeSquareBracket, 'EndListLiteral');
export const parseStartIndexerSymbol = buildSymbolParser(openSquareBracket, 'StartIndexer');
export const parseEndIndexerSymbol = buildSymbolParser(closeSquareBracket, 'EndIndexer');
export const parseStartFunctionCallSymbol = buildSymbolParser(openRoundBracket, 'StartCallParams');
export const parseEndFunctionCallSymbol = buildSymbolParser(closeRoundBracket, 'EndCallParams');
export const parseStartMapLiteralSymbol = buildSymbolParser(openCurlyBracket, 'StartMapLiteral');
export const parseEndMapLiteralSymbol = buildSymbolParser(closeCurlyBracket, 'EndMapLiteral');
export const parseSpreadOperatorSymbol = buildSymbolParser(trippleDot, 'Operator');
export const parseEndMessageSymbol = buildSymbolParser(closeCurlyBracket, 'EndMessageLiteral');

export const parseSpreadOperator = buildSymbolParser(trippleDot, 'Operator');
export const parseNotOperator = buildSymbolParser(exclamation, 'Operator');

export const applicationConnectionGraphBuilder = new GraphBuilder('applicationConnection');
export const applicationGraphBuilder = new GraphBuilder('application');
export const assignmentExpressionGraphBuilder = new GraphBuilder('assignmentExpression');
export const awaitGraphBuilder = new GraphBuilder('await');
export const binaryOperatorGraphBuilder = new GraphBuilder('binaryOperator');
export const captureGraphBuilder = new GraphBuilder('capture');
export const conditionalExpressionGraphBuilder = new GraphBuilder('conditionalExpression');
export const configGraphBuilder = new GraphBuilder('config');
export const configFieldGraphBuilder = new GraphBuilder('configField');
export const constGraphBuilder = new GraphBuilder('const');
export const dataTypeGraphBuilder = new GraphBuilder('dataType');
export const destinationGraphBuilder = new GraphBuilder('destination');
export const destinationListGraphBuilder = new GraphBuilder('destinationList');
export const emitGraphBuilder = new GraphBuilder('emit');
export const enumGraphBuilder = new GraphBuilder('enum');
export const eolGraphBuilder = new GraphBuilder('eol');
export const expectGraphBuilder = new GraphBuilder('expect');
export const expressionTermGraphBuilder = new GraphBuilder('expressionTerm');
export const functionCallGraphBuilder = new GraphBuilder('functionCall');
export const indexExpressionGraphBuilder = new GraphBuilder('indexExpression');
export const literalListGraphBuilder = new GraphBuilder('literalList');
export const literalMapGraphBuilder = new GraphBuilder('literalMap');
export const literalMessageGraphBuilder = new GraphBuilder('literalMessage');
export const messageContextGraphBuilder = new GraphBuilder('messageContext');
export const messageDefinitionGraphBuilder = new GraphBuilder('messageDefinition');
export const messageInitGraphBuilder = new GraphBuilder('messageInit');
export const messageJsonGraphBuilder = new GraphBuilder('messageJson');
export const messageMessageGraphBuilder = new GraphBuilder('messageMessage');
export const messageRouteGraphBuilder = new GraphBuilder('messageRoute');
export const messageTypeSelectorGraphBuilder = new GraphBuilder('messageTypeSelector');
export const namespaceGraphBuilder = new GraphBuilder('namespace');
export const networkGraphBuilder = new GraphBuilder('network');
export const nplGraphBuilder = new GraphBuilder('npl');
export const pipeGraphBuilder = new GraphBuilder('pipe');
export const pipeRouteGraphBuilder = new GraphBuilder('pipeRoute');
export const processAcceptGraphBuilder = new GraphBuilder('processAccept');
export const processGraphBuilder = new GraphBuilder('process');
export const processRouteGraphBuilder = new GraphBuilder('processRoute');
export const routingStatementGraphBuilder = new GraphBuilder('routingStatement');
export const setGraphBuilder = new GraphBuilder('set');
export const subExpressionGraphBuilder = new GraphBuilder('subExpression');
export const testGraphBuilder = new GraphBuilder('test');
export const unaryOperatorGraphBuilder = new GraphBuilder('unaryOperator');
export const usingGraphBuilder = new GraphBuilder('using');
export const varGraphBuilder = new GraphBuilder('var');

export const applicationConnectionGraph = applicationConnectionGraphBuilder.build();
export const applicationGraph = applicationGraphBuilder.build();
export const assignmentExpressionGraph = assignmentExpressionGraphBuilder.build();
export const awaitGraph = awaitGraphBuilder.build();
export const binaryOperatorGraph = binaryOperatorGraphBuilder.build();
export const captureGraph = captureGraphBuilder.build();
export const conditionalExpressionGraph = conditionalExpressionGraphBuilder.build();
export const configGraph = configGraphBuilder.build();
export const configFieldGraph = configFieldGraphBuilder.build();
export const constGraph = constGraphBuilder.build();
export const dataTypeGraph = dataTypeGraphBuilder.build();
export const destinationGraph = destinationGraphBuilder.build();
export const destinationListGraph = destinationListGraphBuilder.build();
export const emitGraph = emitGraphBuilder.build();
export const enumGraph = enumGraphBuilder.build();
export const eolGraph = eolGraphBuilder.build();
export const expectGraph = expectGraphBuilder.build();
export const expressionTermGraph = expressionTermGraphBuilder.build();
export const functionCallGraph = functionCallGraphBuilder.build();
export const indexExpressionGraph = indexExpressionGraphBuilder.build();
export const literalListGraph = literalListGraphBuilder.build();
export const literalMapGraph = literalMapGraphBuilder.build();
export const literalMessageGraph = literalMessageGraphBuilder.build();
export const messageContextGraph = messageContextGraphBuilder.build();
export const messageDefinitionGraph = messageDefinitionGraphBuilder.build();
export const messageInitGraph = messageInitGraphBuilder.build();
export const messageJsonGraph = messageJsonGraphBuilder.build();
export const messageMessageGraph = messageMessageGraphBuilder.build();
export const messageRouteGraph = messageRouteGraphBuilder.build();
export const messageTypeSelectorGraph = messageTypeSelectorGraphBuilder.build();
export const namespaceGraph = namespaceGraphBuilder.build();
export const networkGraph = networkGraphBuilder.build();
export const nplGraph = nplGraphBuilder.build();
export const pipeGraph = pipeGraphBuilder.build();
export const pipeRouteGraph = pipeRouteGraphBuilder.build();
export const processAcceptGraph = processAcceptGraphBuilder.build();
export const processGraph = processGraphBuilder.build();
export const processRouteGraph = processRouteGraphBuilder.build();
export const routingStatementGraph = routingStatementGraphBuilder.build();
export const setGraph = setGraphBuilder.build();
export const subExpressionGraph = subExpressionGraphBuilder.build();
export const testGraph = testGraphBuilder.build();
export const unaryOperatorGraph = unaryOperatorGraphBuilder.build();
export const usingGraph = usingGraphBuilder.build();
export const varGraph = varGraphBuilder.build();
