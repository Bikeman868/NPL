import { EnumValueModel } from './EnumValueModel.js';

export type EnumModel = {
    identifier: string;
    comments: string[];
    values: EnumValueModel[];
};
