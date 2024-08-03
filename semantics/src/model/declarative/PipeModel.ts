import { Named } from '#model/Named.js';
import { Model } from '../Model.js';
import { ConfigModel } from './ConfigModel.js';
import { ConstModel } from './ConstModel.js';
import { EnumModel } from './EnumModel.js';
import { PipeRouteModel } from './PipeRouteModel.js';

export type PipeModel = {
    constants: ConstModel[];
    enums: EnumModel[];
    configs: ConfigModel[];
    routes: PipeRouteModel[];
} & Model &
    Named;
