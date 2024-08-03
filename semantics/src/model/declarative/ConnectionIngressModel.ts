import { Model } from '../Model.js';

export type ConnectionIngressModel = {
    messageType: string;
    networkEndpoints: string[];
} & Model;
