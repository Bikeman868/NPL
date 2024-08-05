import { ModelPrinter } from '#analysis/ModelPrinter.js';
import { VarStatementModel } from '#model/statement/VarStatementModel.js';

export function printVarStatement(this: ModelPrinter, model: VarStatementModel, indent: number) {
    this.printComments(model, indent, false);
    this.printLine(`var ${model.identifier} ${this.formatExpression(model.expression)}`, indent);
}
