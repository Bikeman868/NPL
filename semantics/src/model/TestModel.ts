import { TestStatementModel } from "./TestStatementModel.js";

export type TestModel = {
    name: string;
    comments: string[];
    statements: TestStatementModel[];
};
