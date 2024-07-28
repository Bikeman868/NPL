import { IToken } from "npl-syntax";

export type MessageFieldLifecycle = 'new' | 'current' | 'deprecated';

export type MessageFieldDefinitionModel = {
    identifier: string;
    comments: string[];
    type: IToken[];
    lifecycle: MessageFieldLifecycle;
};
