import { parse } from 'npl-syntax';

import { type IFormatter } from '#interfaces/IFormatter.js';
import { type IPrinter } from '#interfaces/IPrinter.js';

import { Formatter } from '#formatter/Formatter.js';
import { ConsolePrinter } from '#printers/ConsolePrinter.js';
import { readFileSync } from 'node:fs';
import { Context } from '#formatter/Context.js';
import { TokenArrayEnumerator } from '#formatter/TokenArrayEnumerator.js';

const sourceFileBytes = readFileSync('../examples/HelloWorld.npl');
const sourceFileText = sourceFileBytes.toString('utf8', 0, sourceFileBytes.length);

const tokens = parse(sourceFileText)
const tokenEnumerator = new TokenArrayEnumerator(tokens);

const formatter: IFormatter = new Formatter();
const printer: IPrinter = new ConsolePrinter();

const context = new Context(printer, tokenEnumerator);
formatter.format(context);
