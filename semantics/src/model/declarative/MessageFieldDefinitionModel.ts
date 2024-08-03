import { IToken } from 'npl-syntax';
import { Model } from '../Model.js';
import { Named } from '#model/Named.js';

export type MessageFieldLifecycle = 'new' | 'current' | 'deprecated';

export type MessageFieldDefinitionModel = {
    type: IToken[];
    lifecycle?: MessageFieldLifecycle;
} & Model &
    Named;
