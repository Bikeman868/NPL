import { ModelPrinter } from '#analysis/ModelPrinter.js';
import { ConfigFieldModel } from '#model/declarative/ConfigFieldModel.js';

export function printConfigField(this: ModelPrinter, model: ConfigFieldModel, indent: number) {
    this.printComments(model, indent, false);
    
    this.print(model.fieldName, indent);
    this.print(' ', indent)
    this.printExpression(model.expression, indent);
    this.flushLine();
}
