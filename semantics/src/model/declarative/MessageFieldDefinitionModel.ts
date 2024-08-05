import { Model } from '../Model.js';
import { Named } from '#model/Named.js';
import { ExpressionModel } from '#model/statement/ExpressionModel.js';
import { IToken } from 'npl-syntax';

export type MessageFieldLifecycle = 'new' | 'current' | 'deprecated';

export type MessageFieldDefinitionModel = {
    type: IToken[];
    lifecycle?: MessageFieldLifecycle;
} & Model &
    Named;
