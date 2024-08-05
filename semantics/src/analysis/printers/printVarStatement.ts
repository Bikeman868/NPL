import { ModelPrinter } from '#analysis/ModelPrinter.js';
import { VarStatementModel } from '#model/statement/VarStatementModel.js';

export function printVarStatement(this: ModelPrinter, model: VarStatementModel, indent: number) {
    this.printComments(model, indent, false);

    this.print('var ', indent)
    this.print(model.identifier, indent)
    this.print(' ', indent);
    this.printExpression(model.expression, indent)
    this.flushLine();
}
