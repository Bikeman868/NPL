import { IContext } from '#interfaces/IContext.js';
import { ParseResult } from '../ParseResult.js';
import {
    identifier,
    qualifiedIdentifier,
    whitespace,
    keyword,
    openCurlyBracket,
    closeCurlyBracket,
    separator,
    closeAngleBracket,
    openAngleBracket,
    openSquareBracket,
    closeSquareBracket,
    newline,
    floatDigit,
    intDigit,
    stringDelimiter,
    lineCommentDelimiter,
} from '#interfaces/charsets.js';
import { TokenType } from '#interfaces/TokenType.js';

/**
 * Defines a function that will attempt to parse the input stream. Returns a result if parsing
 * was sucessful and undefined if the input could not be parsed. When undefined is returned, the
 * context must not be modified because multiple parsers will be tried in succession to decide
 * which way the syntax is going.
 */
export type SyntaxParser = (context: IContext) => ParseResult | undefined;

/**
 * Defines a function that skips over whitespace
 */
export type WhitespaceSkipper = (context: IContext) => void;

/**
 * Skips over spaces and tabs but not line breaks
 */
export const skipSeparators: WhitespaceSkipper = (context: IContext) => {
    context.buffer.skipAny(separator);
};

/**
 * Skips over spaces, tabs and ine breaks
 */
export const skipWhitespace: WhitespaceSkipper = (context: IContext) => {
    context.buffer.skipAny(whitespace);
};

/**
 * Builds a parser function that will expect one of a list of possible reserved words
 * Expects the cursor to be at the first character of the keyword. Skips characters
 * after the keyword ready for the next parser
 */
export function buildKeywordParser(keywords: string[], tokenType: TokenType): SyntaxParser {
    return (context: IContext) => {
        const startPosition = context.buffer.getPosition();
        const text = context.buffer.extractAny(keyword);
        if (keywords.includes(text)) {
            return { text, tokenType };
        }
        context.buffer.setPosition(startPosition);
        return undefined;
    };
}

export const parseBoolean = buildKeywordParser(['true', 'false'], 'BooleanLiteral');

/**
 * Builds a parser that expects a specific string of characters in the input stream
 */
export function buildSymbolParser(symbol: string, tokenType: TokenType): SyntaxParser {
    return (context: IContext) => {
        if (context.buffer.peek(symbol.length) == symbol) {
            context.buffer.skipCount(symbol.length);
            return { text: symbol, tokenType };
        }
        return undefined;
    };
}

/**
 * Builds a parser function that will expect a valid identifier
 * Expects the cursor to be at the first character of the identifier. Skips characters
 * after the identifier ready for the next parser
 */
export function buildIdentifierParser(): SyntaxParser {
    return (context: IContext) => {
        const startPosition = context.buffer.getPosition();
        const text = context.buffer.extractAny(identifier);
        if (text) {
            return { text, tokenType: 'Identifier' };
        }
        context.buffer.setPosition(startPosition);
        return undefined;
    };
}

export const parseIdentifier = buildIdentifierParser();

/**
 * Builds a parser function that will expect a fully qualified identifier name
 * Expects the cursor to be at the first character of the identifier. Skips characters
 * after the identifier ready for the next parser
 */
export function buildQualifiedIdentifierParser(): SyntaxParser {
    return (context: IContext) => {
        const startPosition = context.buffer.getPosition();
        const text = context.buffer.extractAny(qualifiedIdentifier);
        if (text) {
            return { text, tokenType: 'QualifiedIdentifier' };
        }
        context.buffer.setPosition(startPosition);
        return undefined;
    };
}

export const parseQualifiedIdentifier = buildQualifiedIdentifierParser();

/**
 * Builds a parser function that will expect the start of a scope block
 * Expects the cursor to be at the opening {. Skips separator characters
 * but not line breaks after the { ready for the next parser
 */
export function buildOpenScopeParser(): SyntaxParser {
    return (context: IContext) => {
        if (context.buffer.hasScope()) {
            context.buffer.skipCount(1);
            return { text: openCurlyBracket, tokenType: 'StartScope' };
        }
        return undefined;
    };
}

export const parseOpenScope = buildOpenScopeParser();

/**
 * Builds a parser function that will expect the end of a scope block
 * Expects the cursor to be at the closing }. Skips whitespace and line breaks
 * after the } ready for the next parser
 */
export function buildCloseScopeParser(): SyntaxParser {
    return (context: IContext) => {
        if (context.buffer.isEndScope()) {
            context.buffer.skipCount(1);
            return { text: closeCurlyBracket, tokenType: 'EndScope' };
        }
        return undefined;
    };
}

export const parseCloseScope = buildCloseScopeParser();

/**
 * Builds a parser function that will expect a line break and skip over any whitespace
 * ready for the next parser
 */
export function buildEolParser(): SyntaxParser {
    return (context: IContext) => {
        if (context.buffer.isEol()) {
            context.buffer.skipCount(1);
            return { text: newline, tokenType: 'LineBreak' };
        }
        return undefined;
    };
}

export const parseEol = buildEolParser();

/**
 * Builds a parser function that will expect a // comment delimiter and will skip
 * up to the next end of line
 */
export function buildEolCommentParser(): SyntaxParser {
    return (context: IContext) => {
        if (context.buffer.peek(lineCommentDelimiter.length) == lineCommentDelimiter) {
            context.buffer.skipCount(lineCommentDelimiter.length);
            const text = context.buffer.extractToAny([newline]).trim();
            return { text, tokenType: 'Comment' };
        }
        return undefined;
    };
}

export const parseEolComment = buildEolCommentParser();

/**
 * Builds a parser function that will expect a data type. Data types can
 * be fundamental types like string, number, boolean, or any of these followed
 * by [] to denote and array. Data types can also be a message type identifier,
 * or a map<K V>
 */
export function buildBasicTypeParser(): SyntaxParser {
    const types = ['string', 'number', 'date', 'boolean'];
    return (context: IContext) => {
        const startPosition = context.buffer.getPosition();
        let text = context.buffer.extractAny(keyword);
        if (types.includes(text)) {
            context.buffer.skipAny(separator);
            const arrayPosition = context.buffer.getPosition();
            if (context.buffer.extractCount(1) == openSquareBracket) {
                context.buffer.skipAny(separator);
                if (context.buffer.extractCount(1) == closeSquareBracket) {
                    text += openSquareBracket + closeSquareBracket;
                    context.buffer.skipAny(separator);
                } else context.buffer.setPosition(arrayPosition);
            } else context.buffer.setPosition(arrayPosition);
            return { text, tokenType: 'Type' };
        }
        context.buffer.setPosition(startPosition);
        return undefined;
    };
}

export const parseBasicType = buildBasicTypeParser();

/**
 * Builds a parser function that will expect the start of a generic type
 */
export function buildGenericTypeOpenParser(): SyntaxParser {
    const genericTypes = ['map'];
    return (context: IContext) => {
        const startPosition = context.buffer.getPosition();
        const text = context.buffer.extractAny(keyword);
        if (genericTypes.includes(text)) {
            context.buffer.skipAny(separator);
            if (context.buffer.peek(openAngleBracket.length) == openAngleBracket) {
                context.buffer.skipCount(openAngleBracket.length);
                return { text, tokenType: 'StartGeneric' };
            }
        }
        context.buffer.setPosition(startPosition);
        return undefined;
    };
}

export const parseGenericOpen = buildGenericTypeOpenParser();

/**
 * Builds a parser function that will expect the start of a generic type
 */
export function buildGenericTypeCloseParser(): SyntaxParser {
    return (context: IContext) => {
        if (context.buffer.peek(closeAngleBracket.length) == closeAngleBracket) {
            context.buffer.skipCount(closeAngleBracket.length);
            return { text: closeAngleBracket, tokenType: 'EndGeneric' };
        }
        return undefined;
    };
}

export const parseGenericClose = buildGenericTypeCloseParser();

/**
 * Builds a parser for parsing the message type for declaring an
 * identifier. Allows [] after the message type qualified identifier
 */
export function buildMessageTypeParser(): SyntaxParser {
    return (context: IContext) => {
        const startPosition = context.buffer.getPosition();
        let text = context.buffer.extractAny(qualifiedIdentifier);
        if (text) {
            context.buffer.skipAny(separator);
            const arrayPosition = context.buffer.getPosition();
            if (context.buffer.extractCount(1) == openSquareBracket) {
                context.buffer.skipAny(separator);
                if (context.buffer.extractCount(1) == closeSquareBracket) {
                    text += openSquareBracket + closeSquareBracket;
                } else context.buffer.setPosition(arrayPosition);
            } else context.buffer.setPosition(arrayPosition);
            return { text, tokenType: 'Type' };
        }
        context.buffer.setPosition(startPosition);
        return undefined;
    };
}

export const parseMessageType = buildMessageTypeParser();

/**
 * Builds a parser for parsing the start of a message literal
 */
export function buildStartMessageLiteralParser(): SyntaxParser {
    return (context: IContext) => {
        const startPosition = context.buffer.getPosition();
        let text = context.buffer.extractAny(qualifiedIdentifier);
        if (text) {
            context.buffer.skipAny(separator);
            if (context.buffer.extractCount(1) == openCurlyBracket) {
                return { text, tokenType: 'StartMessageLiteral' };
            }
        }
        context.buffer.setPosition(startPosition);
        return undefined;
    };
}

export const parseStartMessageLiteral = buildStartMessageLiteralParser();

export function buildNumberParser(): SyntaxParser {
    return (context: IContext) => {
        if (!intDigit.includes(context.buffer.peek(1))) return undefined;

        const startPosition = context.buffer.getPosition();
        let text = context.buffer.extractAny(floatDigit);
        if (text) {
            return { text, tokenType: 'NumberLiteral' };
        }
        context.buffer.setPosition(startPosition);
        return undefined;
    };
}

export const parseNumber = buildNumberParser();

export function buildStringParser(): SyntaxParser {
    return (context: IContext) => {
        if (!stringDelimiter.includes(context.buffer.peek(1))) return undefined;

        const delimiter = context.buffer.extractCount(1);
        const text = context.buffer.extractString(delimiter);
        return { text, tokenType: 'StringLiteral' };
    };
}

export const parseString = buildStringParser();
