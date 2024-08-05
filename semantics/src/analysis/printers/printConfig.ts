import { ModelPrinter } from '#analysis/ModelPrinter.js';
import { ConfigModel } from '#model/declarative/ConfigModel.js';

export function printConfig(this: ModelPrinter, model: ConfigModel, indent: number) {
    this.printComments(model, indent);
    this.printLine(`config {`, indent);
    for (const field of model.fields) this.printConfigField(field, indent + 1);
    this.printLine('}', indent);
}
