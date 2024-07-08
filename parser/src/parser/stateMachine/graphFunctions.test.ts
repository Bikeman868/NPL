import { describe, it, expect } from 'vitest';
import { parseNextToken } from './graphFunctions.js';
import { ParsableString } from '../ParsableString.js';
import { Context } from '../Context.js';
import { IContext } from '#interfaces/IContext.js';
import { ParseResult } from '../ParseResult.js';
import { TokenType } from '#interfaces/TokenType.js';
import { SyntaxGraph } from '#interfaces/SyntaxGraph.js';
import { buildNplSyntaxGraph } from '#parser/buildNplSyntaxGraph.js';

const nplGraph = buildNplSyntaxGraph();

function buildContext(sourceCode: string, graph: SyntaxGraph): IContext {
    const buffer = new ParsableString(sourceCode);
    return new Context(buffer, graph, false);
}

function expectPath(context: IContext, path: string[]) {
    expect(context.pathLength).toBe(path.length);
    for (let i = 0; i < path.length; i++) expect(context.getPathElement(i)).toBe(path[i]);
}

function expectToken(context: IContext, token: ParseResult | undefined, text: string, tokenType: TokenType) {
    const position = context.buffer.getPosition();
    let contextInfo = `L${position.line} C${position.column}`;
    for (let syntaxError of context.syntaxErrors) {
        contextInfo += '\n' + syntaxError;
    }

    expect(token, contextInfo).not.toBeUndefined();
    expect(token?.text, contextInfo).toBe(text);
    expect(token?.tokenType, contextInfo).toBe(tokenType);
}

function checkNext(context: IContext, text: string, tokenType: TokenType, path?: string[]) {
    expectToken(context, parseNextToken(context), text, tokenType);
    if (path != undefined) expectPath(context, path);
}

describe('Graph', () => {
    it('should parse a simple syntax', () => {
        const sourceCode = `using namespace1
    namespace namespace2 {
        using namespace3
}
`;
        const context = buildContext(sourceCode, nplGraph);

        checkNext(context, 'using', 'Keyword', ['using', 'namespace']);
        checkNext(context, 'namespace1', 'QualifiedIdentifier', []);
        checkNext(context, 'namespace', 'Keyword', ['namespace', 'name']);
        checkNext(context, 'namespace2', 'QualifiedIdentifier', ['namespace', 'definition']);
        checkNext(context, '{', 'StartScope', ['namespace', 'statement']);
        checkNext(context, '\n', 'LineBreak', ['namespace', 'statement']);
        checkNext(context, 'using', 'Keyword', ['namespace', 'using', 'namespace']);
        checkNext(context, 'namespace3', 'QualifiedIdentifier', ['namespace', 'statement']);
        checkNext(context, '}', 'EndScope', ['namespace', 'end']);
        checkNext(context, '\n', 'LineBreak', []);

        expect(parseNextToken(context)).toBeUndefined();
    });

    it('should parse messages', () => {
        const sourceCode = `namespace app {
    message myMessage {
        string stringField
    }
}
`;
        const context = buildContext(sourceCode, nplGraph);

        checkNext(context, 'namespace', 'Keyword', ['namespace', 'name']);
        checkNext(context, 'app', 'QualifiedIdentifier', ['namespace', 'definition']);
        checkNext(context, '{', 'StartScope', ['namespace', 'statement']);
        checkNext(context, '\n', 'LineBreak', ['namespace', 'statement']);

        checkNext(context, 'message', 'Keyword', ['namespace', 'message', 'name']);
        checkNext(context, 'myMessage', 'Identifier', ['namespace', 'message', 'definition']);
        checkNext(context, '{', 'StartScope', ['namespace', 'message', 'fields']);
        checkNext(context, '\n', 'LineBreak', ['namespace', 'message', 'fields']);

        checkNext(context, 'string', 'Type', ['namespace', 'message', 'field', 'identifier']);
        checkNext(context, 'stringField', 'Identifier', ['namespace', 'message', 'field-end']);
        checkNext(context, '\n', 'LineBreak', ['namespace', 'message', 'fields']);

        checkNext(context, '}', 'EndScope', ['namespace', 'message', 'end']);
        checkNext(context, '\n', 'LineBreak', ['namespace', 'statement']);

        checkNext(context, '}', 'EndScope', ['namespace', 'end']);
        checkNext(context, '\n', 'LineBreak', []);

        expect(parseNextToken(context)).toBeUndefined();
    });

    it('should parse expressions', () => {
        const sourceCode = `namespace app {
    network myNetwork {
        config {
            expr1 'Single quotes'
            expr2 "Double quotes"
            expr3 123.56e12 // Comment after expression
            expr4 (1 + 2)
        }
    }
}
`;
        const context = buildContext(sourceCode, nplGraph);

        checkNext(context, 'namespace', 'Keyword');
        checkNext(context, 'app', 'QualifiedIdentifier');
        checkNext(context, '{', 'StartScope');
        checkNext(context, '\n', 'LineBreak');

        checkNext(context, 'network', 'Keyword');
        checkNext(context, 'myNetwork', 'Identifier');
        checkNext(context, '{', 'StartScope');
        checkNext(context, '\n', 'LineBreak');

        checkNext(context, 'config', 'Keyword');
        checkNext(context, '{', 'StartScope');
        checkNext(context, '\n', 'LineBreak');

        checkNext(context, 'expr1', 'Identifier');
        checkNext(context, 'Single quotes', 'StringLiteral');
        checkNext(context, '\n', 'LineBreak');

        checkNext(context, 'expr2', 'Identifier');
        checkNext(context, 'Double quotes', 'StringLiteral');
        checkNext(context, '\n', 'LineBreak');

        checkNext(context, 'expr3', 'Identifier');
        checkNext(context, '123.56e12', 'NumberLiteral');
        checkNext(context, 'Comment after expression', 'Comment');
        checkNext(context, '\n', 'LineBreak');

        checkNext(context, 'expr4', 'Identifier');
        checkNext(context, '(', 'StartSubExpression');
        checkNext(context, '1', 'NumberLiteral');
        checkNext(context, '+', 'Operator');
        checkNext(context, '2', 'NumberLiteral');
        checkNext(context, ')', 'EndSubExpression');
        checkNext(context, '\n', 'LineBreak');

        checkNext(context, '}', 'EndScope');
        checkNext(context, '\n', 'LineBreak');

        checkNext(context, '}', 'EndScope');
        checkNext(context, '\n', 'LineBreak');

        checkNext(context, '}', 'EndScope');
        checkNext(context, '\n', 'LineBreak');

        expect(parseNextToken(context)).toBeUndefined();
    });

    it('should parse comments', () => {
        const sourceCode = `// Line1 comment
// Line2 comment
// Line3 comment
`;
        const context = buildContext(sourceCode, nplGraph);

        checkNext(context, 'Line1 comment', 'Comment');
        checkNext(context, '\n', 'LineBreak');
        checkNext(context, 'Line2 comment', 'Comment');
        checkNext(context, '\n', 'LineBreak');
        checkNext(context, 'Line3 comment', 'Comment');
        checkNext(context, '\n', 'LineBreak');

        expect(parseNextToken(context)).toBeUndefined();
    });
});
