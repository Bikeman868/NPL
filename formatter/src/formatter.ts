import { IFormatter } from '#interfaces/IFormatter.js';
import { Formatter } from '#formatter/Formatter.js';
import { parse } from 'npl-syntax'
import { StringPrinter } from '#printers/StringPrinter.js';
import { Context } from '#formatter/Context.js';
import { ITokenEnumerator } from '../../semantics/src/interfaces/ITokenStream.js';
import { TokenArrayEnumerator } from '#formatter/TokenArrayEnumerator.js';

export function format(sourceText: string): string {
    const tokens = parse(sourceText)
    const tokenEnumerator: ITokenEnumerator = new TokenArrayEnumerator(tokens);
    const formatter: IFormatter = new Formatter();
    const stringPrinter = new StringPrinter();
    const context = new Context(stringPrinter, tokenEnumerator);
    
    formatter.format(context);

    return stringPrinter.getOutput();
}

export { buildInfo } from './buildInfo.js'

export { type IFormatter } from '#interfaces/IFormatter.js';
export { type IPrinter } from '#interfaces/IPrinter.js';

export { Formatter } from '#formatter/Formatter.js';

export { ConsolePrinter } from '#printers/ConsolePrinter.js';
export { StringPrinter } from '#printers/StringPrinter.js';
export { FilePrinter } from '#printers/FilePrinter.js';
