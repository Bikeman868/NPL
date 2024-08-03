import { IToken } from 'npl-syntax';
import { Model } from '../Model.js';
import { StatementBlock } from '../StatementBlock.js';
import { Statement } from '../Statement.js';

export type WhileStatementModel = {
    expression: IToken[];
} & Model &
    Statement &
    StatementBlock;
