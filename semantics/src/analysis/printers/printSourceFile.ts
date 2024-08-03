import { ModelPrinter } from '#analysis/ModelPrinter.js';
import { SourceFileModel } from '#model/declarative/SourceFileModel.js';

export function printSourceFile(this: ModelPrinter, model: SourceFileModel, indent: number) {
    for (const using of model.usings) this.printUsing(using, indent);
    for (const namespace of model.namespaces) this.printNamespace(namespace, indent);
}
