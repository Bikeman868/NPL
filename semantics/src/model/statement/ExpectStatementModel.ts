import { Model } from '../Model.js';
import { Statement } from '../Statement.js';
import { ExpressionModel } from './ExpressionModel.js';

export type ExpectStatementModel = {
    expression: ExpressionModel;
} & Model &
    Statement;
