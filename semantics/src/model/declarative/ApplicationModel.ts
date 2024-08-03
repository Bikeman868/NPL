import { Named } from '#model/Named.js';
import { Model } from '../Model.js';
import { ConfigModel } from './ConfigModel.js';
import { ConnectionModel } from './ConnectionModel.js';

export type ApplicationModel = {
    configs: ConfigModel[];
    connections: ConnectionModel[];
} & Model &
    Named;
