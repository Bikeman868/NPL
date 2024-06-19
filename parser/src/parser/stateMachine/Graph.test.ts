import { describe, it, expect } from 'vitest';
import { Graph, parseNextToken } from './Graph';
import { ParsableString } from '../ParsableString';
import { Context } from '../Context';
import { IContext } from '#interfaces/IContext';
import { nplGraph } from '../graphs/nplGraph';
import { ParseResult } from '../ParseResult';
import { TokenType } from '#interfaces/TokenType';

function buildContext(sourceCode: string): IContext {
    const buffer = new ParsableString(sourceCode);
    return new Context(buffer, false);
}

function expectPath(context: IContext, path: string[]) {
    expect(context.pathLength).toBe(path.length);
    for (let i = 0; i < path.length; i++) expect(context.getPathElement(i)).toBe(path[i]);
}

function expectToken(token: ParseResult | undefined, text: string, tokenType: TokenType) {
    expect(token).not.toBeUndefined();
    expect(token?.text).toBe(text);
    expect(token?.tokenType).toBe(tokenType);
}

function checkNext(context: IContext, graph: Graph, text: string, tokenType: TokenType, path?: string[]) {
    expectToken(parseNextToken(context, graph), text, tokenType);
    if (path != undefined) expectPath(context, path);
}

describe('Graph', () => {
    it('should parse a simple syntax', () => {
        const sourceCode = `using namespace1
    namespace namespace2 {
        using namespace3
}
`;
        const context = buildContext(sourceCode);

        checkNext(context, nplGraph, 'using', 'Keyword', ['using', 'namespace']);
        checkNext(context, nplGraph, 'namespace1', 'QualifiedIdentifier', []);
        checkNext(context, nplGraph, 'namespace', 'Keyword', ['namespace', 'name']);
        checkNext(context, nplGraph, 'namespace2', 'QualifiedIdentifier', ['namespace', 'definition']);
        checkNext(context, nplGraph, '{', 'StartScope', ['namespace', 'statement']);
        checkNext(context, nplGraph, '\n', 'LineBreak', ['namespace', 'statement']);
        checkNext(context, nplGraph, 'using', 'Keyword', ['namespace', 'using', 'namespace']);
        checkNext(context, nplGraph, 'namespace3', 'QualifiedIdentifier', ['namespace', 'statement']);
        checkNext(context, nplGraph, '}', 'EndScope', ['namespace', 'end']);
        checkNext(context, nplGraph, '\n', 'LineBreak', []);

        expect(parseNextToken(context, nplGraph)).toBeUndefined();
    });

    it('should parse messages', () => {
        const sourceCode = `namespace app {
    message myMessage {
        string stringField
    }
}
`;
        const context = buildContext(sourceCode);

        checkNext(context, nplGraph, 'namespace', 'Keyword', ['namespace', 'name']);
        checkNext(context, nplGraph, 'app', 'QualifiedIdentifier', ['namespace', 'definition']);
        checkNext(context, nplGraph, '{', 'StartScope', ['namespace', 'statement']);
        checkNext(context, nplGraph, '\n', 'LineBreak', ['namespace', 'statement']);

        checkNext(context, nplGraph, 'message', 'Keyword', ['namespace', 'message', 'name']);
        checkNext(context, nplGraph, 'myMessage', 'Identifier', ['namespace', 'message', 'definition']);
        checkNext(context, nplGraph, '{', 'StartScope', ['namespace', 'message', 'fields']);
        checkNext(context, nplGraph, '\n', 'LineBreak', ['namespace', 'message', 'fields']);

        checkNext(context, nplGraph, 'string', 'Type', ['namespace', 'message', 'field', 'identifier']);
        checkNext(context, nplGraph, 'stringField', 'Identifier', ['namespace', 'message', 'field-end']);
        checkNext(context, nplGraph, '\n', 'LineBreak', ['namespace', 'message', 'fields']);

        checkNext(context, nplGraph, '}', 'EndScope', ['namespace', 'message', 'end']);
        checkNext(context, nplGraph, '\n', 'LineBreak', ['namespace', 'statement']);

        checkNext(context, nplGraph, '}', 'EndScope', ['namespace', 'end']);
        checkNext(context, nplGraph, '\n', 'LineBreak', []);

        expect(parseNextToken(context, nplGraph)).toBeUndefined();
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
        const context = buildContext(sourceCode);

        checkNext(context, nplGraph, 'namespace', 'Keyword');
        checkNext(context, nplGraph, 'app', 'QualifiedIdentifier');
        checkNext(context, nplGraph, '{', 'StartScope');
        checkNext(context, nplGraph, '\n', 'LineBreak');

        checkNext(context, nplGraph, 'network', 'Keyword');
        checkNext(context, nplGraph, 'myNetwork', 'Identifier');
        checkNext(context, nplGraph, '{', 'StartScope');
        checkNext(context, nplGraph, '\n', 'LineBreak');

        checkNext(context, nplGraph, 'config', 'Keyword');
        checkNext(context, nplGraph, '{', 'StartScope');
        checkNext(context, nplGraph, '\n', 'LineBreak');

        checkNext(context, nplGraph, 'expr1', 'Identifier');
        checkNext(context, nplGraph, 'Single quotes', 'StringLiteral');
        checkNext(context, nplGraph, '\n', 'LineBreak');

        checkNext(context, nplGraph, 'expr2', 'Identifier');
        checkNext(context, nplGraph, 'Double quotes', 'StringLiteral');
        checkNext(context, nplGraph, '\n', 'LineBreak');

        checkNext(context, nplGraph, 'expr3', 'Identifier');
        checkNext(context, nplGraph, '123.56e12', 'NumberLiteral');
        checkNext(context, nplGraph, 'Comment after expression', 'Comment');
        checkNext(context, nplGraph, '\n', 'LineBreak');

        checkNext(context, nplGraph, 'expr4', 'Identifier');
        checkNext(context, nplGraph, '(', 'StartSubExpression');
        checkNext(context, nplGraph, '1', 'NumberLiteral');
        checkNext(context, nplGraph, '+', 'Operator');
        checkNext(context, nplGraph, '2', 'NumberLiteral');
        checkNext(context, nplGraph, ')', 'EndSubExpression');
        checkNext(context, nplGraph, '\n', 'LineBreak');

        checkNext(context, nplGraph, '}', 'EndScope');
        checkNext(context, nplGraph, '\n', 'LineBreak');

        checkNext(context, nplGraph, '}', 'EndScope');
        checkNext(context, nplGraph, '\n', 'LineBreak');

        checkNext(context, nplGraph, '}', 'EndScope');
        checkNext(context, nplGraph, '\n', 'LineBreak');

        expect(parseNextToken(context, nplGraph)).toBeUndefined();
    });

    it('should parse comments', () => {
        const sourceCode = `// Line1 comment
// Line2 comment
// Line3 comment
`;
        const context = buildContext(sourceCode);

        checkNext(context, nplGraph, 'Line1 comment', 'Comment');
        checkNext(context, nplGraph, '\n', 'LineBreak');
        checkNext(context, nplGraph, 'Line2 comment', 'Comment');
        checkNext(context, nplGraph, '\n', 'LineBreak');
        checkNext(context, nplGraph, 'Line3 comment', 'Comment');
        checkNext(context, nplGraph, '\n', 'LineBreak');

        expect(parseNextToken(context, nplGraph)).toBeUndefined();
    });
});
