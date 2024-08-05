import { Model } from '../Model.js';
import { StatementBlock } from '../StatementBlock.js';
import { Statement } from '../Statement.js';
import { ExpressionModel } from './ExpressionModel.js';

export type WhileStatementModel = {
    expression: ExpressionModel;
} & Model &
    Statement &
    StatementBlock;
