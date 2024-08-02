import { ModelPrinter } from '#analysis/ModelPrinter.js';
import { EmitStatementModel } from '#model/EmitStatementModel.js';
import { ExpectStatementModel } from '#model/ExpectStatementModel.js';
import { TestStatementModel } from '#model/TestStatementModel.js';

export function printTestStatement(this: ModelPrinter, model: TestStatementModel, indent: number) {
    this.printComments(model, indent, true);
    switch (model.statementType) {
        case 'emit':
            this.printEmitStatement(model.statement as EmitStatementModel, indent + 1);
        case 'expect':
            this.printExpectStatement(model.statement as ExpectStatementModel, indent + 1);
        default:
            throw `Test statement printer does not know how to print ${model.statementType} statements`;
    }
}
