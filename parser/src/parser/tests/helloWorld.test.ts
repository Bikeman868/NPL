import { describe, expect, test } from '@jest/globals';
import { Parser } from '../Parser.js';
import { Context } from '../Context.js';
import { ParsableString } from '../ParsableString.js';

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

describe('Parser module', () => {
  test('Parses Hello World application', () => {
    const buffer = new ParsableString(helloWorld);
    const context = new Context(buffer);
    const parser = new Parser();
    do {
      const token = parser.extractNextToken(context);
      console.log(token.length + ':"' + token.text + '"');
    } while (!buffer.isEof());
  });
});
