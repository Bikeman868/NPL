import { IToken } from 'npl-syntax';
import { AwaitModel } from './AwaitModel.js';
import { Model } from '../Model.js';
import { Statement } from '../Statement.js';
import { ExpressionModel } from './ExpressionModel.js';

export type EmitStatementModel = {
    expression: ExpressionModel;
    await: AwaitModel | undefined;
} & Model &
    Statement;
