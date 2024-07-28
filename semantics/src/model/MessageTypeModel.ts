import { MessageFieldDefinitionModel } from './MessageFieldDefinitionModel.js';

export type MessageTypeModel = {
    identifier: string;
    comments: string[];
    fields: MessageFieldDefinitionModel[];
};
