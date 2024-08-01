import { EmitStatementModel } from "./EmitStatementModel.js";
import { ExpectStatementModel } from "./ExpectStatementModel.js";

export type TestStatementModel = {
    comments: string[];
    statementType: 'emit' | 'expect';
    statement: EmitStatementModel | ExpectStatementModel;
};
