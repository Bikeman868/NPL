import { ConfigModel } from './ConfigModel.js';
import { ConnectionModel } from './ConnectionModel.js';

export type ApplicationModel = {
    identifier: string;
    comments: string[];
    configs: ConfigModel[];
    connections: ConnectionModel[];
};
