import { ModelPrinter } from '#analysis/ModelPrinter.js';
import { EnumValueModel } from '#model/declarative/EnumValueModel.js';

export function printEnumValue(this: ModelPrinter, model: EnumValueModel, indent: number) {
    this.printComments(model, indent, false);
    this.printLine(model.identifier, indent);
}
