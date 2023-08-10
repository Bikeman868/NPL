import { describe, it, expect } from 'vitest';
import { Parser } from './Parser.js';
import { Context } from './Context.js';
import { ParsableString } from './ParsableString.js';
import { Printer } from '../printer/Printer.js';

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

describe('Parser', () => {
  it('should extract keywords', () => {
    const buffer = new ParsableString(helloWorld);
    const context = new Context(buffer, false);
    const parser = new Parser();

    const tokens = parser.parse(context);
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
});
