import { Named } from '#model/Named.js';
import { Model } from '../Model.js';
import { EnumValueModel } from './EnumValueModel.js';

export type EnumModel = {
    values: EnumValueModel[];
} & Model &
    Named;
