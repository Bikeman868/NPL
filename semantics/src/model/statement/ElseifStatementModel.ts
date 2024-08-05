import { IToken } from 'npl-syntax';
import { Model } from '../Model.js';
import { Statement } from '../Statement.js';
import { StatementBlock } from '../StatementBlock.js';
import { ExpressionModel } from './ExpressionModel.js';

export type ElseifStatementModel = {
    expression: ExpressionModel;
} & Model &
    Statement &
    StatementBlock;
