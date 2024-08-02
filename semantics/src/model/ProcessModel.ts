import { AcceptModel } from './AcceptModel.js';
import { ConfigModel } from './ConfigModel.js';
import { ConstModel } from './ConstModel.js';
import { EnumModel } from './EnumModel.js';
import { MessageTypeModel } from './MessageTypeModel.js';
import { TestModel } from './TestModel.js';

export type ProcessModel = {
    identifier: string;
    comments: string[];
    constants: ConstModel[];
    enums: EnumModel[];
    configs: ConfigModel[];
    messageTypes: MessageTypeModel[];
    accepts: AcceptModel[];
    tests: TestModel[];
};
