import { ModelPrinter } from '#analysis/ModelPrinter.js';
import { ConfigModel } from '#model/declarative/ConfigModel.js';

export function printConfig(this: ModelPrinter, model: ConfigModel, indent: number) {
    this.printComments(model, indent);
    this.printLine(`config {`, indent);
    for (const field of model.fields) {
        let expression = '';
        for (const token of field.expression) expression += token.tokenType + '(' + token.text + ') ';
        this.printComments(field, indent + 1, false);
        this.printLine(`${field.fieldName} ${expression}`, indent + 1);
    }
    this.printLine('}', indent);
}
