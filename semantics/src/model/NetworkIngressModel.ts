import { MessageDestinationModel } from './MessageDestinationModel.js';

export type NetworkIngressModel = {
    endpointName: string;
    comments: string[];
    destinations: MessageDestinationModel[];
};
