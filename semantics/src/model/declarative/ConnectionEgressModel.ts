import { Model } from '../Model.js';

export type ConnectionEgressModel = {
    messageType: string;
    networkEndpoints: string[];
} & Model;
