import { Named } from '#model/Named.js';
import { Model } from '../Model.js';
import { Statement } from '../Statement.js';
import { StatementBlock } from '../StatementBlock.js';
import { ExpressionModel } from './ExpressionModel.js';

export type ForStatementModel = {
    expression: ExpressionModel;
    iterationType: 'keys' | 'values';
} & Model &
    Named &
    Statement &
    StatementBlock;
