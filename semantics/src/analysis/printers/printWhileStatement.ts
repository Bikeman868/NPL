import { ModelPrinter } from '#analysis/ModelPrinter.js';
import { WhileStatementModel } from '#model/statement/WhileStatementModel.js';

export function printWhileStatement(this: ModelPrinter, model: WhileStatementModel, indent: number) {
    this.printComments(model, indent);
    this.printLine(`while ${this.formatExpression(model.expression)} {`, indent);
    for (const statement of model.statements) this.printStatement(statement, indent + 1);
    this.printLine('}', indent);
}
