import { ModelPrinter } from '#analysis/ModelPrinter.js';
import { WhileStatementModel } from '#model/statement/WhileStatementModel.js';

export function printWhileStatement(this: ModelPrinter, model: WhileStatementModel, indent: number) {
    this.printComments(model, indent);

    this.print('while ', indent);
    this.printExpression(model.expression, indent);
    this.print(' {', indent)
    this.flushLine();

    for (const statement of model.statements) this.printStatement(statement, indent + 1);
    this.printLine('}', indent);
}
