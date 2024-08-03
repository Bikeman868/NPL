import { IToken } from 'npl-syntax';
import { AwaitModel } from './AwaitModel.js';
import { Model } from '../Model.js';
import { Statement } from '../Statement.js';

export type EmitStatementModel = {
    expression: IToken[];
    await: AwaitModel | undefined;
} & Model &
    Statement;
