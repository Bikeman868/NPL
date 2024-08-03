import { IToken } from 'npl-syntax';
import { Model } from '../Model.js';
import { Statement } from '../Statement.js';
import { StatementBlock } from '../StatementBlock.js';

export type IfStatementModel = {
    expression: IToken[];
} & Model &
    Statement &
    StatementBlock;
