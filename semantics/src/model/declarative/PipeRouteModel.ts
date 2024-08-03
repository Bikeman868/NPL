import { Model } from '../Model.js';
import { StatementBlock } from '../StatementBlock.js';

export type PipeRouteModel = {
    messageType: string;
} & Model &
    StatementBlock;
