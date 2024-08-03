import { Model } from '#model/Model.js';
import { Named } from '#model/Named.js';
import { Statement } from '#model/Statement.js';
import { IToken } from 'npl-syntax';

export type VarStatementModel = {
    expression: IToken[];
} & Model &
    Named &
    Statement;
