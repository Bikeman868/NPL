import { describe, it, expect } from 'vitest';
import { Parser } from './Parser.js';
import { Context } from './Context.js';
import { ParsableString } from './ParsableString.js';
import { IToken } from '#interfaces/IToken.js';
import { TokenType } from '#interfaces/TokenType.js';
import { SyntaxError } from '#interfaces/SyntaxError.js';

const helloWorld = `using npl.connection

namespace App {
    message Response {
        string text
    }

    network Hello {
        ingress egress default {
            process Responder
        }

        process Responder {
            accept * { // Accept all message types
                emit Response { 
                    data { text 'Hello, world' }
                }
            }
        }
    }
}

namespace App {
    application HelloWorld {
        connection emitter {
            config { 
                count 1 
                interval 0
                message empty
            }
            ingress Hello
        }

        connection console {
            config { mode console.lines }
            egress Hello
        }
    }
}`;

function parse(sourceCode: string): IToken[] {
  const buffer = new ParsableString(sourceCode);
  const context = new Context(buffer, false);
  const parser = new Parser();
  return parser.parse(context);
}

function syntaxCheck(sourceCode: string): SyntaxError[] {
  const buffer = new ParsableString(sourceCode);
  const context = new Context(buffer, false);
  const parser = new Parser();
  parser.parse(context);
  return context.syntaxErrors;
}

function expectTokens(
  expected: { type: TokenType; text: string | undefined }[],
  actual: IToken[],
) {
  expect(actual.length).toBe(expected.length);

  for (const index in expected) {
    expect(actual[index].tokenType).toBe(expected[index].type);
    if (expected[index].text) {
      expect(actual[index].text).toBe(expected[index].text);
    }
  }
}

function expectSyntaxErrors(
  expected: { line: number; column: number; message: string }[],
  actual: SyntaxError[],
) {
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
    expect(keywords[i++].text).toBe('egress');
    expect(keywords[i++].text).toBe('default');
    expect(keywords[i++].text).toBe('process');
    expect(keywords[i++].text).toBe('process');
    expect(keywords[i++].text).toBe('accept');
    expect(keywords[i++].text).toBe('emit');
    expect(keywords[i++].text).toBe('data');
    expect(keywords[i++].text).toBe('namespace');
    expect(keywords[i++].text).toBe('application');
    expect(keywords[i++].text).toBe('connection');
    expect(keywords[i++].text).toBe('config');
    expect(keywords[i++].text).toBe('ingress');
    expect(keywords[i++].text).toBe('connection');
    expect(keywords[i++].text).toBe('config');
    expect(keywords[i++].text).toBe('egress');
  });

  it('should parse empty namespace', () => {
    expectTokens(
      [
        { type: 'Keyword', text: 'namespace' },
        { type: 'Identifier', text: 'app' },
        { type: 'ScopeStart', text: '{' },
        { type: 'ScopeEnd', text: '}' },
      ],
      parse('namespace app {}'),
    );

    expectTokens(
      [
        { type: 'Keyword', text: 'namespace' },
        { type: 'Identifier', text: 'app' },
        { type: 'ScopeStart', text: '{' },
        { type: 'ScopeEnd', text: '}' },
      ],
      parse('namespace app{}'),
    );

    expectTokens(
      [
        { type: 'Keyword', text: 'namespace' },
        { type: 'Identifier', text: 'app' },
        { type: 'ScopeStart', text: '{' },
        { type: 'ScopeEnd', text: '}' },
      ],
      parse('namespace app{ }'),
    );

    expectTokens(
      [
        { type: 'Keyword', text: 'namespace' },
        { type: 'Identifier', text: 'app' },
        { type: 'ScopeStart', text: '{' },
        { type: 'ScopeEnd', text: '}' },
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
          message:
            'Keyword namespace must be followed by the name of the namespace',
        },
      ],
      syntaxCheck('namespace { }'),
    );

    expectSyntaxErrors(
      [
        {
          line: 1,
          column: 10,
          message:
            'Keyword namespace must be followed by the name of the namespace',
        },
      ],
      syntaxCheck('namespace{}'),
    );

    expectSyntaxErrors(
      [
        {
          line: 2,
          column: 1,
          message:
            'Keyword namespace must be followed by the name of the namespace',
        },
      ],
      syntaxCheck('namespace \n{ }'),
    );
  });

  it('should report syntax error eol before scope block', () => {
    expectSyntaxErrors(
      [
        {
          line: 2,
          column: 1,
          message: 'Expecting "config", "using", "namespace", but found "{"',
        },
      ],
      syntaxCheck('namespace name\n{\n}'),
    );
  });
});
