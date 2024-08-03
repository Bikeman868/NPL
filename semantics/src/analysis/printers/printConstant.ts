import { ModelPrinter } from '#analysis/ModelPrinter.js';
import { ConstModel } from '#model/declarative/ConstModel.js';

export function printConstant(this: ModelPrinter, model: ConstModel, indent: number) {
    this.printComments(model, indent, false);
    this.printLine(`const ${model.identifier} ${this.formatExpression(model.expression)}`, indent);
}
