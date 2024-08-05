import { ModelPrinter } from '#analysis/ModelPrinter.js';
import { ConfigFieldModel } from '#model/declarative/ConfigFieldModel.js';

export function printConfigField(this: ModelPrinter, model: ConfigFieldModel, indent: number) {
    this.printComments(model, indent, false);
    this.printLine(`${model.fieldName} ${this.formatExpression(model.expression)}`, indent);
}
