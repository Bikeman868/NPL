import { ConfigModel } from './ConfigModel.js';
import { ConnectionEgressModel } from './ConnectionEgressModel.js';
import { ConnectionIngressModel } from './ConnectionIngressModel.js';

export type ConnectionModel = {
    typeIdentifier: string;
    identifier: string;
    comments: string[];
    ingresses: ConnectionIngressModel[];
    egresses: ConnectionEgressModel[];
    configs: ConfigModel[];
};
