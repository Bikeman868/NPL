import { expect, test } from 'vitest'
import { ParsableString } from './ParsableString.js'

  test('Skips whitespace', () => {
    const buffer = new ParsableString('  hello    there ');
    expect(buffer.getPosition().offset).toBe(0)
    expect(buffer.getPosition().line).toBe(1)
    expect(buffer.getPosition().column).toBe(1)
    
    buffer.skipWhitespace()
    expect(buffer.getPosition().offset).toBe(2)
    expect(buffer.getPosition().line).toBe(1)
    expect(buffer.getPosition().column).toBe(3)

    const hello = buffer.extractToWhitespace()
    expect(buffer.getPosition().offset).toBe(7)
    expect(buffer.getPosition().line).toBe(1)
    expect(buffer.getPosition().column).toBe(8)
    expect(hello).toBe('hello');

    buffer.skipWhitespace()
    expect(buffer.getPosition().offset).toBe(11)
    expect(buffer.getPosition().line).toBe(1)
    expect(buffer.getPosition().column).toBe(12)

    const there = buffer.extractToWhitespace()
    expect(buffer.getPosition().offset).toBe(16)
    expect(buffer.getPosition().line).toBe(1)
    expect(buffer.getPosition().column).toBe(17)
    expect(there).toBe('there');
  });
