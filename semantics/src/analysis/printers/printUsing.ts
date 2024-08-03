import { ModelPrinter } from '#analysis/ModelPrinter.js';
import { UsingModel } from '#model/declarative/UsingModel.js';

export function printUsing(this: ModelPrinter, model: UsingModel, indent: number) {
    this.printComments(model, indent);
    this.printLine(`using ${model.namespace}`, indent);
}
