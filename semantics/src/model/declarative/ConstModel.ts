import { IToken } from 'npl-syntax';
import { Model } from '../Model.js';
import { Named } from '#model/Named.js';

export type ConstModel = {
    expression: IToken[];
} & Model &
    Named;
