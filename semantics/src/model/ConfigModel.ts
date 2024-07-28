import { ConfigFieldModel } from './ConfigFieldModel.js';

export type ConfigModel = {
    identifier: string;
    comments: string[];
    fields: ConfigFieldModel[];
};
