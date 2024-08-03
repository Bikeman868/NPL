import { Model } from '../Model.js';
import { MessageDestinationModel } from '../declarative/MessageDestinationModel.js';
import { Statement } from '../Statement.js';

export type AppendStatementModel = {
    destinations: MessageDestinationModel[];
} & Model &
    Statement;
