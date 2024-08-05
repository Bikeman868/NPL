import { Model } from '#model/Model.js';
import { Named } from '#model/Named.js';
import { Statement } from '#model/Statement.js';
import { ExpressionModel } from './ExpressionModel.js';

export type VarStatementModel = {
    expression: ExpressionModel;
} & Model &
    Named &
    Statement;
