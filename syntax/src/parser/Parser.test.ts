import { describe, it, expect } from 'vitest';
import { Parser } from './Parser.js';
import { Context } from './Context.js';
import { ParsableString } from './ParsableString.js';
import { IToken } from '#interfaces/IToken.js';
import { TokenType } from '#interfaces/TokenType.js';
import { SyntaxError } from '#interfaces/SyntaxError.js';
import { buildNplSyntaxGraph } from './buildNplSyntaxGraph.js';

const helloWorld = `using npl.connection

namespace App {
    message Response {
        string text
    }

    network Hello {
        ingress default {
            process Responder
        }

        egress default {
            empty
        }

        process Responder {
            accept * { // Accept all message types
                emit Response { 
                    message text 'Hello, world'
                }
            }
        }
    }
}

namespace App {
    application HelloWorld {
        connection Emitter emitter {
            config { 
                count 1 
                interval 0
            }
            ingress * hello
        }

        connection Console console {
            config mode console.lines
            egress * hello
        }
    }
}`;

const nplGraph = buildNplSyntaxGraph();

function parse(sourceCode: string): IToken[] {
    const buffer = new ParsableString(sourceCode);
    const context = new Context(buffer, nplGraph, false);
    const parser = new Parser();
    const tokens = parser.parse(context);
    return tokens;
}

function syntaxCheck(sourceCode: string): SyntaxError[] {
    const buffer = new ParsableString(sourceCode);
    const context = new Context(buffer, nplGraph, false);
    const parser = new Parser();
    parser.parse(context);
    return context.syntaxErrors;
}

function expectTokens(expected: { type: TokenType; text: string | undefined }[], actual: IToken[]) {
    expect(actual.length).toBe(expected.length);

    for (const index in expected) {
        expect(actual[index].tokenType).toBe(expected[index].type);
        if (expected[index].text) {
            expect(actual[index].text).toBe(expected[index].text);
        }
    }
}

function expectSyntaxErrors(expected: { line: number; column: number; message: string }[], actual: SyntaxError[]) {
    expect(actual.length).greaterThanOrEqual(expected.length);
    for (const index in expected) {
        expect(actual[index].line).toBe(expected[index].line);
        expect(actual[index].column).toBe(expected[index].column);
        expect(actual[index].message).toBe(expected[index].message);
    }
}

describe('Parser', () => {
    it('should extract keywords', () => {
        const tokens = parse(helloWorld);
        const keywords = tokens.filter((token) => token.tokenType === 'Keyword');

        let i = 0;
        expect(keywords[i++].text).toBe('using');
        expect(keywords[i++].text).toBe('namespace');
        expect(keywords[i++].text).toBe('message');
        expect(keywords[i++].text).toBe('network');
        expect(keywords[i++].text).toBe('ingress');
        expect(keywords[i++].text).toBe('default');
        expect(keywords[i++].text).toBe('process');
        expect(keywords[i++].text).toBe('egress');
        expect(keywords[i++].text).toBe('default');
        expect(keywords[i++].text).toBe('empty');
        expect(keywords[i++].text).toBe('process');
        expect(keywords[i++].text).toBe('accept');
        expect(keywords[i++].text).toBe('*');
        expect(keywords[i++].text).toBe('emit');
        expect(keywords[i++].text).toBe('message');
        expect(keywords[i++].text).toBe('namespace');
        expect(keywords[i++].text).toBe('application');
        expect(keywords[i++].text).toBe('connection');
        expect(keywords[i++].text).toBe('config');
        expect(keywords[i++].text).toBe('ingress');
        expect(keywords[i++].text).toBe('*');
        expect(keywords[i++].text).toBe('connection');
        expect(keywords[i++].text).toBe('config');
        expect(keywords[i++].text).toBe('egress');
        expect(keywords[i++].text).toBe('*');
    });

    it('should parse empty namespace', () => {
        expectTokens(
            [
                { type: 'Keyword', text: 'namespace' },
                { type: 'QualifiedIdentifier', text: 'app' },
                { type: 'StartScope', text: '{' },
                { type: 'EndScope', text: '}' },
            ],
            parse('namespace app {}'),
        );

        expectTokens(
            [
                { type: 'Keyword', text: 'namespace' },
                { type: 'QualifiedIdentifier', text: 'app' },
                { type: 'StartScope', text: '{' },
                { type: 'EndScope', text: '}' },
            ],
            parse('namespace app{}'),
        );

        expectTokens(
            [
                { type: 'Keyword', text: 'namespace' },
                { type: 'QualifiedIdentifier', text: 'app' },
                { type: 'StartScope', text: '{' },
                { type: 'EndScope', text: '}' },
            ],
            parse('namespace app{ }'),
        );

        expectTokens(
            [
                { type: 'Keyword', text: 'namespace' },
                { type: 'QualifiedIdentifier', text: 'app' },
                { type: 'StartScope', text: '{' },
                { type: 'LineBreak', text: '\n' },
                { type: 'EndScope', text: '}' },
            ],
            parse('  namespace   app {\n  }'),
        );
    });

    it('should report syntax error on missing identifier', () => {
        expectSyntaxErrors(
            [
                {
                    line: 1,
                    column: 11,
                    message: 'Expecting fully qualified identifier',
                },
            ],
            syntaxCheck('namespace { }'),
        );

        expectSyntaxErrors(
            [
                {
                    line: 1,
                    column: 10,
                    message: 'Expecting fully qualified identifier',
                },
            ],
            syntaxCheck('namespace{}'),
        );

        expectSyntaxErrors(
            [
                {
                    line: 1,
                    column: 11,
                    message: 'Expecting fully qualified identifier',
                },
            ],
            syntaxCheck('namespace \n{ }'),
        );
    });

    it('should parse comments at the start of the file', () => {
        expectTokens(
            [
                { type: 'Comment', text: 'comment' },
                { type: 'LineBreak', text: '\n' },
                { type: 'Keyword', text: 'namespace' },
                { type: 'QualifiedIdentifier', text: 'app' },
                { type: 'StartScope', text: '{' },
                { type: 'EndScope', text: '}' },
            ],
            parse('// comment\nnamespace app{}'),
        );

        expectTokens(
            [
                { type: 'Comment', text: 'line1\nline2' },
                { type: 'LineBreak', text: '\n' },
                { type: 'Keyword', text: 'namespace' },
                { type: 'QualifiedIdentifier', text: 'app' },
                { type: 'StartScope', text: '{' },
                { type: 'EndScope', text: '}' },
            ],
            parse('/* line1\nline2 */\nnamespace app{}'),
        );
    });

    it('should parse comment to end of line', () => {
        expectTokens(
            [
                { type: 'Keyword', text: 'namespace' },
                { type: 'QualifiedIdentifier', text: 'app' },
                { type: 'StartScope', text: '{' },
                { type: 'Comment', text: 'comment' },
                { type: 'LineBreak', text: '\n' },
                { type: 'EndScope', text: '}' },
            ],
            parse('namespace app { // comment\n}'),
        );
    });

    it('should parse block comments', () => {
        expectTokens(
            [
                { type: 'Keyword', text: 'namespace' },
                { type: 'QualifiedIdentifier', text: 'app' },
                { type: 'StartScope', text: '{' },
                { type: 'Comment', text: 'comment' },
                { type: 'EndScope', text: '}' },
            ],
            parse('namespace app { /* comment */ }'),
        );
    });

    it('should ignore linefeeds', () => {
        expectTokens(
            [
                { type: 'Keyword', text: 'namespace' },
                { type: 'QualifiedIdentifier', text: 'app' },
                { type: 'StartScope', text: '{' },
                { type: 'LineBreak', text: '\n' },
                { type: 'EndScope', text: '}' },
                { type: 'LineBreak', text: '\n' },
            ],
            parse('namespace app {\r\n  }\r\n'),
        );

        expectTokens(
            [
                { type: 'Keyword', text: 'namespace' },
                { type: 'QualifiedIdentifier', text: 'app' },
                { type: 'StartScope', text: '{' },
                { type: 'LineBreak', text: '\n' },
                { type: 'Keyword', text: 'network' },
                { type: 'Identifier', text: 'Hello' },
                { type: 'StartScope', text: '{' },
                { type: 'LineBreak', text: '\n' },
                { type: 'EndScope', text: '}' },
                { type: 'LineBreak', text: '\n' },
                { type: 'EndScope', text: '}' },
                { type: 'LineBreak', text: '\n' },
            ],
            parse('namespace app {\r\n  network Hello {\r\n  }\r\n}\r\n'),
        );
    });
});
