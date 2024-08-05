import { ModelPrinter } from '#analysis/ModelPrinter.js';
import { ElseifStatementModel } from '#model/statement/ElseifStatementModel.js';

export function printElseifStatement(this: ModelPrinter, model: ElseifStatementModel, indent: number) {
    this.printComments(model, indent);

    this.print('elseif ', indent);
    this.printExpression(model.expression, indent);
    this.print(' {', indent)
    this.flushLine();

    for (const statement of model.statements) this.printStatement(statement, indent + 1);
    this.printLine('}', indent);
}
