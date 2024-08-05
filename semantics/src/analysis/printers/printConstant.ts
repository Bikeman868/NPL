import { ModelPrinter } from '#analysis/ModelPrinter.js';
import { ConstModel } from '#model/declarative/ConstModel.js';

export function printConstant(this: ModelPrinter, model: ConstModel, indent: number) {
    this.printComments(model, indent, false);
    
    this.print('const ', indent)
    this.print(model.identifier, indent)
    this.print(' ', indent);
    this.printExpression(model.expression, indent)
    this.flushLine();
}
