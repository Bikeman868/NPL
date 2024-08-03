import { Named } from '#model/Named.js';
import { Model } from '../Model.js';
import { StatementBlock } from '../StatementBlock.js';

export type AcceptModel = {
    messageType: string;
} & Model &
    StatementBlock &
    Named;
