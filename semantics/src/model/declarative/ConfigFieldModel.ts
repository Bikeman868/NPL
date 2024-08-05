import { IToken } from 'npl-syntax';
import { Model } from '../Model.js';
import { ExpressionModel } from '#model/statement/ExpressionModel.js';

export type ConfigFieldModel = {
    fieldName: string;
    expression: ExpressionModel;
} & Model;
