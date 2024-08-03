import { MessageDestinationModel } from '../declarative/MessageDestinationModel.js';
import { Model } from '../Model.js';
import { Statement } from '../Statement.js';

export type RemoveStatementModel = {
    destinations: MessageDestinationModel[];
} & Model &
    Statement;
