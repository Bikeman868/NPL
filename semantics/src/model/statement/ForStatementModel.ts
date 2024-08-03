import { Named } from '#model/Named.js';
import { IToken } from 'npl-syntax';
import { Model } from '../Model.js';
import { Statement } from '../Statement.js';
import { StatementBlock } from '../StatementBlock.js';

export type ForStatementModel = {
    expression: IToken[];
    iterationType: 'keys' | 'values';
} & Model &
    Named &
    Statement &
    StatementBlock;
