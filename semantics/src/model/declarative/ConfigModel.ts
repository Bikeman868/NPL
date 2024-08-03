import { Named } from '#model/Named.js';
import { Model } from '../Model.js';
import { ConfigFieldModel } from './ConfigFieldModel.js';

export type ConfigModel = {
    fields: ConfigFieldModel[];
} & Model &
    Named;
