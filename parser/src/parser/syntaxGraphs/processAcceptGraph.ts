import { GraphBuilder } from '../stateMachine/GraphBuilder.js';
import {
    skipSeparators,
    parseQualifiedIdentifier,
    parseOpenScope,
    parseCloseScope,
    parseIdentifier,
} from '../stateMachine/SyntaxParser.js';
import {
    conditionalExpressionGraph,
    constGraph,
    emitGraph,
    eolGraph,
    functionCallGraph,
    parseAcceptKeyword,
    parseAnyMessageTypeKeyword,
    parseBreakKeyword,
    parseConditionalKeyword,
    parseElseKeyword,
    parseEmptyKeyword,
    parseForKeyword,
    parseForOfInKeyword,
    processAwaitGraph,
    processRouteGraph,
    setGraph,
    varGraph,
} from '../index.js';

const statementGraphBuilder: GraphBuilder = new GraphBuilder('process-statement');
const statemenScopeBlockGraphBuilder: GraphBuilder = new GraphBuilder('process-scope-block');
const functionCallStatementGraphBuilder: GraphBuilder = new GraphBuilder('function-call-statement');

// prettier-ignore
/** Examples

    myMap.set('key, 'value)<EOL>

*/
functionCallStatementGraphBuilder
    .graph.start
        .transition(parseQualifiedIdentifier, skipSeparators, 'function-call')
    .graph.state('function-call')
        .subGraph('function-call', functionCallGraph, 'end')
    .graph.state('end')
        .subGraph('end', eolGraph)
    .graph.build();

// prettier-ignore
/** Examples

    emit MyMessage message count 1<EOL>

    if config.flag {
        emit someMessage
    }<EOL>

    myMap.set('key, 'value)<EOL>

*/
statementGraphBuilder
    .graph.start
        .transition(parseConditionalKeyword, skipSeparators, 'conditional')
        .transition(parseForKeyword, skipSeparators, 'for-loop')
        .transition(parseElseKeyword, skipSeparators, 'else')
        .transition(parseBreakKeyword, skipSeparators)
        .subGraph('blank-line', eolGraph)
        .subGraph('emit', emitGraph)
        .subGraph('await', processAwaitGraph)
        .subGraph('const', constGraph)
        .subGraph('var', varGraph)
        .subGraph('set', setGraph)
        .subGraph('route', processRouteGraph)
        .subGraph('function-call', functionCallStatementGraphBuilder.build())
    .graph.state('conditional')
        .subGraph('expression', conditionalExpressionGraph, 'conditional-eol')
    .graph.state('conditional-eol')
        .subGraph('conditional-eol', eolGraph, 'statement-block')
    .graph.state('statement-block')
        .subGraph('statements', statemenScopeBlockGraphBuilder.build())
    .graph.state('for-loop')
        .transition(parseIdentifier, skipSeparators, 'loop-type')
    .graph.state('loop-type')
        .transition(parseForOfInKeyword, skipSeparators, 'conditional')
    .graph.state('else')
        .transition(parseOpenScope, skipSeparators, 'statement-block')
        .subGraph('else-single-statement', statementGraphBuilder.build())
    .graph.build();

// prettier-ignore
/** Examples
 * 
        emit MyMessage
        emit MyMessage
        if config.flag {
            emit someMessage
        }
    }<EOL>

*/
statemenScopeBlockGraphBuilder
    .graph.start
        .transition(parseCloseScope, skipSeparators, 'end')
        .subGraph('blank-first-line', eolGraph, 'statements')
        .subGraph('first-statement', statementGraphBuilder.build(), 'statements')
    .graph.state('statements')
        .transition(parseCloseScope, skipSeparators, 'end')
        .subGraph('blank-line', eolGraph, 'statements')
        .subGraph('next-statement', statementGraphBuilder.build(), 'statements')
    .graph.state('end')
        .subGraph('end', eolGraph)
    .graph.build();

// prettier-ignore
/** Examples
 
    accept MessageType<EOL>

    accept MessageType {}<EOL>

    accept MessageType {
    }<EOL>

    accept MessageType messageType<EOL>

    accept MessageType messageType {}<EOL>

    accept MessageType messageType {
    }<EOL>

    accept empty {
        emit MyMessage message count 1
    }<EOL>

    accept * someMessage {
        if config.flag {
            emit someMessage {
                message count 1
                context network bigData 'Not so big'
            }
        }
    }<EOL>

    accept namespace.MessageType message {
        await SomeMessage
    }<EOL>
*/
export function defineProcessAcceptGraph(builder: GraphBuilder) {
    builder.clear()
    .graph.start
        .transition(parseAcceptKeyword, skipSeparators, 'message-type')
    .graph.state('message-type')
        .transition(parseEmptyKeyword, skipSeparators, 'identifier')
        .transition(parseAnyMessageTypeKeyword, skipSeparators, 'identifier')
        .transition(parseQualifiedIdentifier, skipSeparators, 'identifier')
    .graph.state('identifier')
        .transition(parseIdentifier, skipSeparators, 'has-identifier')
        .transition(parseOpenScope, skipSeparators, 'statements')
        .subGraph('placeholder-definition', eolGraph)
    .graph.state('has-identifier')
        .transition(parseOpenScope, skipSeparators, 'statements')
        .subGraph('identified-placeholder', eolGraph)
    .graph.state('statements')
        .subGraph('blank-line', eolGraph, 'statements')
        .subGraph('scope-block', statemenScopeBlockGraphBuilder.build())
    .graph.build();
}
