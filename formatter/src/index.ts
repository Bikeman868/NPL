import { IFormatter } from '#interfaces/IFormatter.js';
import { Formatter } from '#formatter/Formatter.js';
import { parse } from 'npl-parser'

const sourceText = 'namespace app';
const tokens = parse(sourceText)
const formatter: IFormatter = new Formatter();
console.log( formatter.format(tokens));
