import { ModelPrinter } from '#analysis/ModelPrinter.js';
import { ElseStatementModel } from '#model/statement/ElseStatementModel.js';

export function printElseStatement(this: ModelPrinter, model: ElseStatementModel, indent: number) {
    this.printComments(model, indent);
    this.printLine(`else {`, indent);
    for (const statement of model.statements) this.printStatement(statement, indent + 1);
    this.printLine('}', indent);
}
