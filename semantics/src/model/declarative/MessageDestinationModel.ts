import { Named } from '#model/Named.js';
import { Model } from '../Model.js';

export type DestinationKind = 'network' | 'pipe' | 'process';

export type MessageDestinationModel = {
    qualifiedIdentifier: string;
    kind?: DestinationKind;
} & Model;
