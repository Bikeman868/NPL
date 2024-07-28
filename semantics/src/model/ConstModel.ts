import { IToken } from 'npl-syntax';

export type ConstModel = {
    identifier: string;
    comments: string[];
    expression: IToken[];
};
