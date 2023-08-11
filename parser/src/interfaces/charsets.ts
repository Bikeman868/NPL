export type Charset = Iterable<String>;

export const cr = '\n';
export const lf = '\r';
export const tab = '\t';
export const space = ' ';
export const openScope = '{';
export const closeScope = '}';
export const lineCommentDelimiter = '/';
export const blockCommentDelimiter = '*';
export const decimal = '.';

export const separator: Charset = [space, tab];
export const whitespace: Charset = [...separator, cr, lf];
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
export const digit: Charset = [
  '0',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
];
export const alpha: Charset = [...lowercase, ...uppercase];
export const alphanumeric: Charset = [...alpha, ...digit];
export const identifier: Charset = [...alphanumeric, decimal];
