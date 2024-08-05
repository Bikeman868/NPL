import { ModelPrinter } from '#analysis/ModelPrinter.js';
import { SetStatementModel } from '#model/statement/SetStatementModel.js';

export function printSetStatement(this: ModelPrinter, model: SetStatementModel, indent: number) {
    this.printComments(model, indent, false);
    
    this.print('set ', indent)
    this.print(model.identifier, indent)
    this.print(' ', indent);
    this.printExpression(model.expression, indent)
    this.flushLine();
}
