import { Named } from '#model/Named.js';
import { Model } from '../Model.js';
import { ConfigModel } from './ConfigModel.js';
import { ConnectionEgressModel } from './ConnectionEgressModel.js';
import { ConnectionIngressModel } from './ConnectionIngressModel.js';

export type ConnectionModel = {
    typeIdentifier: string;
    ingresses: ConnectionIngressModel[];
    egresses: ConnectionEgressModel[];
    configs: ConfigModel[];
} & Model &
    Named;
