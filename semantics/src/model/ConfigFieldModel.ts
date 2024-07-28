import { IToken } from 'npl-syntax';

export type ConfigFieldModel = {
    fieldName: string;
    comments: string[];
    expression: IToken[];
};
