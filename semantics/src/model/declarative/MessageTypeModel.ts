import { Named } from '#model/Named.js';
import { Model } from '../Model.js';
import { MessageFieldDefinitionModel } from './MessageFieldDefinitionModel.js';

export type MessageTypeModel = {
    fields: MessageFieldDefinitionModel[];
} & Model &
    Named;
