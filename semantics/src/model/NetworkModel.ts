import { ConfigModel } from './ConfigModel.js';
import { ConstModel } from './ConstModel.js';
import { EnumModel } from './EnumModel.js';
import { MessageTypeModel } from './MessageTypeModel.js';
import { NetworkEgressModel } from './NetworkEgressModel.js';
import { NetworkIngressModel } from './NetworkIngressModel.js';
import { PipeModel } from './PipeModel.js';
import { ProcessModel } from './ProcessModel.js';

export type NetworkModel = {
    identifier: string;
    comments: string[];
    configs: ConfigModel[];
    constants: ConstModel[];
    enums: EnumModel[];
    ingresses: NetworkIngressModel[];
    egresses: NetworkEgressModel[];
    messageTypes: MessageTypeModel[];
    pipes: PipeModel[];
    processes: ProcessModel[];
};
