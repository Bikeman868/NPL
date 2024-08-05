import { ModelPrinter } from '#analysis/ModelPrinter.js';
import { SetStatementModel } from '#model/statement/SetStatementModel.js';

export function printSetStatement(this: ModelPrinter, model: SetStatementModel, indent: number) {
    this.printComments(model, indent, false);
    this.printLine(`set ${model.identifier} ${this.formatExpression(model.expression)}`, indent);
}
