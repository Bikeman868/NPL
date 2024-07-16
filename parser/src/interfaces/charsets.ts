import { generateKey } from 'crypto';

export type Charset = Iterable<string> & {
    includes: (searchElement: string) => boolean;
};

export const newline = '\n';
export const cr = '\r';
export const tab = '\t';
export const space = ' ';
export const openCurlyBracket = '{';
export const closeCurlyBracket = '}';
export const openRoundBracket = '(';
export const closeRoundBracket = ')';
export const openSquareBracket = '[';
export const closeSquareBracket = ']';
export const openAngleBracket = '<';
export const closeAngleBracket = '>';
export const comma = ',';
export const questionMark = '?';
export const lineCommentDelimiter = '//';
export const blockCommentStart = '/*';
export const blockCommentEnd = '*/';
export const decimal = '.';
export const underscore = '_';
export const singleQuote = "'";
export const doubleQuote = '"';
export const backQuote = '`';
export const trippleDot = '...';
export const exclamation = '!';

export const lowercase: Charset = [
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'j',
    'k',
    'l',
    'm',
    'n',
    'o',
    'p',
    'q',
    'r',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
    'y',
    'z',
];
export const uppercase: Charset = [
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z',
];
export const digit: Charset = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
export const alpha: Charset = [...lowercase, ...uppercase];
export const keyword: Charset = lowercase;
export const alphanumeric: Charset = [...alpha, ...digit];
export const identifier: Charset = [...alphanumeric, underscore];
export const qualifiedIdentifier: Charset = [...identifier, decimal];
export const typeIdentifier: Charset = [
    ...identifier,
    decimal,
    openSquareBracket,
    closeSquareBracket,
    openAngleBracket,
    closeAngleBracket,
];
export const separator: Charset = [space, tab];
export const whitespace: Charset = [...separator, newline];
export const symbol: Charset = ['!', '%', '^', '&', '*', '-', '+', '=', '/', '?', ':', '<', '>', '~', ','];
export const intDigit: Charset = [...digit, '+', '-'];
export const floatDigit: Charset = [...intDigit, decimal, 'e'];
export const stringDelimiter: Charset = [singleQuote, doubleQuote, backQuote];
