import { Model } from '../Model.js';
import { MessageDestinationModel } from './MessageDestinationModel.js';

export type NetworkIngressModel = {
    endpointName: string;
    destinations: MessageDestinationModel[];
} & Model;
