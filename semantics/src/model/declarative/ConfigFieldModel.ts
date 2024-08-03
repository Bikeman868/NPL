import { IToken } from 'npl-syntax';
import { Model } from '../Model.js';

export type ConfigFieldModel = {
    fieldName: string;
    expression: IToken[];
} & Model;
