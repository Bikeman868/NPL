import { Named } from '#model/Named.js';
import { Model } from '../Model.js';
import { StatementBlock } from '../StatementBlock.js';
import { ConfigModel } from './ConfigModel.js';
import { ConstModel } from './ConstModel.js';
import { EnumModel } from './EnumModel.js';

export type AcceptModel = {
    messageType: string;
    configs: ConfigModel[];
    constants: ConstModel[];
    enums: EnumModel[];
} & Model &
    StatementBlock &
    Named;
