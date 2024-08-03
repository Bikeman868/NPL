import { AcceptModel } from './AcceptModel.js';
import { Model } from '../Model.js';
import { ConfigModel } from './ConfigModel.js';
import { ConstModel } from './ConstModel.js';
import { EnumModel } from './EnumModel.js';
import { MessageTypeModel } from './MessageTypeModel.js';
import { TestModel } from './TestModel.js';
import { Named } from '#model/Named.js';

export type ProcessModel = {
    constants: ConstModel[];
    enums: EnumModel[];
    configs: ConfigModel[];
    messageTypes: MessageTypeModel[];
    accepts: AcceptModel[];
    tests: TestModel[];
} & Model &
    Named;
