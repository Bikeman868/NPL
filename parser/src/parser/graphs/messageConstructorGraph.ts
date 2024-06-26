import { GraphBuilder } from '#parser/stateMachine/GraphBuilder.js';
import { parseCloseScope, parseOpenScope, skipSeparators } from '#parser/stateMachine/SyntaxParser.js';
import { eolGraph, messageContextGraph, messageMessageGraph, messageRouteGraph } from '../index.js';

// prettier-ignore
/* Examples
    {
        message field1 value1
        context network networkField someValue
    }

    {
        message {
            field1 value1
            field2 value2
        }
        context {
            message {
                context1 value1
                context2 value2
            }
            network {
                network1 value1
                network2 value2
            }
        }
        route {
            clear
            append pipe pipe1
        }
    }
*/
export function defineMessageConstructorGraph(builder: GraphBuilder) {
    builder.clear()
    .graph.start
        .transition(parseOpenScope, skipSeparators, 'definition')
    .graph.state('definition')
        .transition(parseCloseScope, skipSeparators)
        .subGraph('blank-line', eolGraph, 'definition')
        .subGraph('message-message', messageMessageGraph, 'definition')
        .subGraph('message-context', messageContextGraph, 'definition')
        .subGraph('message-route', messageRouteGraph, 'definition')
    .graph.build();
}
