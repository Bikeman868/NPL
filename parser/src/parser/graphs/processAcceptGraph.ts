import { openCurlyBracket, closeCurlyBracket } from '#interfaces/charsets.js';
import { GraphBuilder } from '../stateMachine/GraphBuilder.js';
import {
    buildKeywordParser,
    buildSymbolParser,
    skipSeparators,
    parseQualifiedIdentifier,
    parseOpenScope,
    parseCloseScope,
    parseIdentifier,
} from '../stateMachine/SyntaxParser.js';
import { processAwaitGraph } from './processAwaitGraph.js';
import { emitGraph } from './emitGraph.js';
import { constGraph } from './constGraph.js';
import { varGraph } from './varGraph.js';
import { eolGraph } from './eolGraph.js';
import { processRouteGraph } from './processRouteGraph.js';
import { conditionalExpressionGraph } from './expressionGraph.js';
import { setGraph } from './setGraph.js';

const parseAccept = buildKeywordParser(['accept'], 'Keyword');
const parseEmpty = buildKeywordParser(['empty'], 'Keyword');
const parseAny = buildSymbolParser('*', 'Keyword');

const statementGraphBuilder: GraphBuilder = new GraphBuilder('process-statement');
const statemenScopeBlockGraphBuilder: GraphBuilder = new GraphBuilder('process-scope-block');

// prettier-ignore
/** Examples

    emit MyMessage message count 1<EOL>

    if config.flag {
        emit someMessage
    }<EOL>

*/
statementGraphBuilder
    .graph.start
        .transition('"if", "elseif", "while"', buildKeywordParser(['if', 'elseif', 'while'], 'Keyword'), skipSeparators, 'conditional')
        .transition('"for"', buildKeywordParser(['for'], 'Keyword'), skipSeparators, 'for-loop')
        .subGraph('emit', emitGraph)
        .subGraph('await', processAwaitGraph)
        .subGraph('const', constGraph)
        .subGraph('var', varGraph)
        .subGraph('set', setGraph)
        .subGraph('route', processRouteGraph)
    .graph.state('conditional')
        .subGraph('expression', conditionalExpressionGraph, 'conditional-eol')
    .graph.state('conditional-eol')
        .subGraph('conditional-eol', eolGraph, 'conditional-statement')
    .graph.state('conditional-statement')
        .subGraph('statements', statemenScopeBlockGraphBuilder.build())
    .graph.state('for-loop')
        .transition('identifier', parseIdentifier, skipSeparators, 'loop-type')
    .graph.state('loop-type')
        .transition('"of", "in"', buildKeywordParser(['of', 'in'], 'Keyword'), skipSeparators, 'conditional')
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
        .subGraph('first-statement', statementGraphBuilder.build(), 'statements')
    .graph.state('statements')
        .transition(closeCurlyBracket, parseCloseScope, skipSeparators, 'end')
        .subGraph('blank-line', eolGraph, 'statements')
        .subGraph('next-statement', statementGraphBuilder.build(), 'statements')
    .graph.state('end')
        .subGraph('end', eolGraph)
    .graph.build();

// prettier-ignore
/** Examples
 
    accept MessageType<EOL>

    accept MessageType messageType<EOL>

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
export const processAcceptGraph = new GraphBuilder('accept')
    .graph.start
        .transition('"accept"', parseAccept, skipSeparators, 'message-type')
    .graph.state('message-type')
        .transition('"empty"', parseEmpty, skipSeparators, 'identifier')
        .transition('"*"', parseAny, skipSeparators, 'identifier')
        .transition('the type of message to accept', parseQualifiedIdentifier, skipSeparators, 'identifier')
    .graph.state('identifier')
        .transition('message identifier', parseIdentifier, skipSeparators, 'has-identifier')
        .transition(openCurlyBracket, parseOpenScope, skipSeparators, 'statements')
        .subGraph('placeholder-definition', eolGraph)
    .graph.state('has-identifier')
        .transition(openCurlyBracket, parseOpenScope, skipSeparators, 'statements')
        .subGraph('identified-placeholder', eolGraph)
    .graph.state('statements')
        .subGraph('blank-line', eolGraph, 'statements')
        .subGraph('scope-block', statemenScopeBlockGraphBuilder.build())
    .graph.build();
