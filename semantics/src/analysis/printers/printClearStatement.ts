import { ModelPrinter } from '#analysis/ModelPrinter.js';
import { ClearStatementModel } from '#model/statement/ClearStatementModel.js';

export function printClearStatement(this: ModelPrinter, model: ClearStatementModel, indent: number) {
    this.printComments(model, indent, false);
    this.printLine(`clear`, indent);
}