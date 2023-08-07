import { describe, it, expect } from 'vitest';
import { Parser } from './Parser.js';
import { Context } from './Context.js';
import { ParsableString } from './ParsableString.js';

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
            accept * {
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
    const context = new Context(buffer);
    const parser = new Parser();

    const keywords = parser
      .parse(context)
      .filter((token) => token.tokenType === 'Keyword');
    expect(keywords[0].text).toBe('using');
    expect(keywords[1].text).toBe('namespace');
    expect(keywords[2].text).toBe('message');
    expect(keywords[3].text).toBe('string');
    expect(keywords[4].text).toBe('network');
    expect(keywords[5].text).toBe('ingress');
    expect(keywords[6].text).toBe('egress');
    expect(keywords[7].text).toBe('default');
    expect(keywords[8].text).toBe('process');
    expect(keywords[9].text).toBe('process');
    expect(keywords[10].text).toBe('accept');
    expect(keywords[11].text).toBe('emit');
    expect(keywords[12].text).toBe('data');
    expect(keywords[13].text).toBe('namespace');
    expect(keywords[14].text).toBe('application');
    expect(keywords[15].text).toBe('connection');
    expect(keywords[16].text).toBe('config');
    expect(keywords[17].text).toBe('ingress');
    expect(keywords[17].text).toBe('connection');
    expect(keywords[17].text).toBe('config');
    expect(keywords[17].text).toBe('egress');
  });
});
