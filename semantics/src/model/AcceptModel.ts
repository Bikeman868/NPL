import { AcceptStatementModel } from "./AcceptStatementModel.js";

export type AcceptModel = {
    messageType: string;
    identifier: string;
    comments: string[];
    statements: AcceptStatementModel[];
};
