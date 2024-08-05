import { Model } from '../Model.js';
import { Named } from '#model/Named.js';
import { ExpressionModel } from '#model/statement/ExpressionModel.js';

export type ConstModel = {
    expression: ExpressionModel;
} & Model &
    Named;
