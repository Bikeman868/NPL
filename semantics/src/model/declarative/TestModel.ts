import { Model } from '#model/Model.js';
import { StatementBlock } from '#model/StatementBlock.js';

export type TestModel = {
    name: string;
} & Model &
    StatementBlock;
