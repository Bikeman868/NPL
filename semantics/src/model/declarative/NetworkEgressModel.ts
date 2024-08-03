import { Model } from '../Model.js';

export type NetworkEgressModel = {
    endpointName: string;
    messageTypes: string[];
} & Model;
