import { IToken } from 'npl-syntax';
import { Model } from '../Model.js';
import { Statement } from '../Statement.js';

export type ExpectStatementModel = {
    expression: IToken[];
} & Model &
    Statement;
