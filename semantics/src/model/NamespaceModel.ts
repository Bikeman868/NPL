import { ApplicationModel } from './ApplicationModel.js';
import { ConfigModel } from './ConfigModel.js';
import { ConstModel } from './ConstModel.js';
import { EnumModel } from './EnumModel.js';
import { MessageTypeModel } from './MessageTypeModel.js';
import { NetworkModel } from './NetworkModel.js';
import { UsingModel } from './UsingModel.js';

export type NamespaceModel = {
    identifier: string;
    comments: string[];
    usings: UsingModel[];
    configs: ConfigModel[];
    messageTypes: MessageTypeModel[];
    enums: EnumModel[];
    constants: ConstModel[];
    networks: NetworkModel[];
    applications: ApplicationModel[];
};
