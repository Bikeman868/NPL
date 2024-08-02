import { RoutingStatementModel } from './RoutingStatementModel.js';

export type PipeRouteModel = {
    messageType: string;
    comments: string[];
    statements: RoutingStatementModel[];
};
