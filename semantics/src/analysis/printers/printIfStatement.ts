import { ModelPrinter } from '#analysis/ModelPrinter.js';
import { IfStatementModel } from '#model/statement/IfStatementModel.js';

export function printIfStatement(this: ModelPrinter, model: IfStatementModel, indent: number) {
    this.printComments(model, indent);

    this.print('if ', indent);
    this.printExpression(model.expression, indent);
    this.print(' {', indent)
    this.flushLine();

    for (const statement of model.statements) this.printStatement(statement, indent + 1);
    this.printLine('}', indent);
}
