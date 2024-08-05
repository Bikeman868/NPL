import { Named } from '#model/Named.js';
import { Model } from '../Model.js';
import { Statement } from '../Statement.js';
import { ExpressionModel } from './ExpressionModel.js';

export type SetStatementModel = {
    expression: ExpressionModel;
} & Model &
    Named &
    Statement;
