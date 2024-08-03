import { Named } from '#model/Named.js';
import { IToken } from 'npl-syntax';
import { Model } from '../Model.js';
import { Statement } from '../Statement.js';

export type SetStatementModel = {
    expression: IToken[];
} & Model &
    Named &
    Statement;
