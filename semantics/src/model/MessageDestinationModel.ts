export type DestinationKind = 'network' | 'pipe' | 'process';

export type MessageDestinationModel = {
    comments: string[];
    kind?: DestinationKind;
    identifier: string;
};
