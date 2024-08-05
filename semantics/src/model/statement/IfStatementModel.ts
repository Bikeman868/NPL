import { Model } from '../Model.js';
import { Statement } from '../Statement.js';
import { StatementBlock } from '../StatementBlock.js';
import { ExpressionModel } from './ExpressionModel.js';

export type IfStatementModel = {
    expression: ExpressionModel;
} & Model &
    Statement &
    StatementBlock;
