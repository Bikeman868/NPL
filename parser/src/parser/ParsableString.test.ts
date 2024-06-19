import { describe, it, expect } from 'vitest';
import { ParsableString } from './ParsableString.js';
import { alpha, identifier, newline, symbol, whitespace } from '#interfaces/charsets.js';

describe('ParsableString', () => {
    it('should skip leading whitespace', () => {
        const buffer = new ParsableString('  Hello    There ');
        expect(buffer.getPosition().offset).toBe(2);
        expect(buffer.getPosition().line).toBe(1);
        expect(buffer.getPosition().column).toBe(3);
    });

    it('should parse whitespace', () => {
        const buffer = new ParsableString('  Hello    There ');

        const hello = buffer.extractAny(alpha);
        expect(buffer.getPosition().offset).toBe(7);
        expect(buffer.getPosition().line).toBe(1);
        expect(buffer.getPosition().column).toBe(8);
        expect(hello).toBe('Hello');

        buffer.skipAny(whitespace);
        expect(buffer.getPosition().offset).toBe(11);
        expect(buffer.getPosition().line).toBe(1);
        expect(buffer.getPosition().column).toBe(12);

        const there = buffer.extractAny(alpha);
        expect(buffer.getPosition().offset).toBe(16);
        expect(buffer.getPosition().line).toBe(1);
        expect(buffer.getPosition().column).toBe(17);
        expect(there).toBe('There');
    });

    it('should peek', () => {
        const buffer = new ParsableString('/* line 1\r\n line 2 */\r\nsome code // comment \r\nmore code');
        expect(buffer.peek(2)).toBe('/*');
        buffer.skipCount(2);
        expect(buffer.extractUntil('*/')).toBe(' line 1\n line 2 ');
        buffer.skipCount(3);
        expect(buffer.extractToAny(whitespace)).toBe('some');
        buffer.skipAny(whitespace);
        expect(buffer.extractToEol()).toBe('code ');
        expect(buffer.peek(2)).toBe('//');
        buffer.skipCount(2);
        buffer.skipAny(whitespace);
        expect(buffer.extractToAny([newline])).toBe('comment ');
    });

    it('should end lines at }', () => {
        const buffer = new ParsableString('line1 trailing\nline2 }\nline3');
        expect(buffer.extractAny(identifier)).toBe('line1');
        buffer.skipToEol();
        expect(buffer.extractCount(1)).toBe('\n');
        expect(buffer.extractAny(identifier)).toBe('line2');
        buffer.skipToEol();
        expect(buffer.extractCount(1)).toBe('}');
        buffer.skipToEol();
        expect(buffer.extractCount(1)).toBe('\n');
        expect(buffer.extractAny(identifier)).toBe('line3');
    });

    it('should skip to end of scope', () => {
        const buffer = new ParsableString('name expression {} }\n');
        expect(buffer.extractAny(identifier)).toBe('name');
        buffer.skipAny(whitespace);
        expect(buffer.extractToEol()).toBe('expression {} ');
        expect(buffer.extractCount(2)).toBe('}\n');
    });

    it('should parse delimited strings', () => {
        const buffer = new ParsableString('a="a string";');
        expect(buffer.extractAny(identifier)).toBe('a');
        expect(buffer.extractAny(symbol)).toBe('=');
        expect(buffer.extractCount(1)).toBe('"');
        expect(buffer.extractString('"')).toBe('a string');
        expect(buffer.extractCount(1)).toBe(';');
    });
});
