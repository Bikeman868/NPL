import { ModelPrinter } from '#analysis/ModelPrinter.js';
import { EnumModel } from '#model/declarative/EnumModel.js';

export function printEnum(this: ModelPrinter, model: EnumModel, indent: number) {
    this.printComments(model, indent, true);
    if (model.values.length < 6 && model.values.reduce((sum, value) => sum + value.comments.length, 0) == 0) {
        const values = model.values.reduce((text, value) => text + ' ' + value.identifier, '');
        this.printLine(`enum ${model.identifier}${values}`, indent);
    } else {
        this.printLine(`enum ${model.identifier} {`, indent);
        let priorHasComments = false;
        for (const value of model.values) {
            if (priorHasComments) this.printBlankLine();
            priorHasComments = this.printComments(value, indent + 1, false);
            this.printLine(`${value.identifier}`, indent + 1);
        }
        this.printLine('}', indent);
    }
}
