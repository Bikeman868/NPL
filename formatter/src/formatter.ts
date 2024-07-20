import { IFormatter } from '#interfaces/IFormatter.js';
import { Formatter } from '#formatter/Formatter.js';
import { parse } from 'npl-parser'

export function format(sourceText: string): string {
    const tokens = parse(sourceText)
    const formatter: IFormatter = new Formatter();
    return formatter.format(tokens);
}

export { buildInfo } from 'buildInfo.js'
export { IFormatter } from '#interfaces/IFormatter.js';
export { Formatter } from '#formatter/Formatter.js';
