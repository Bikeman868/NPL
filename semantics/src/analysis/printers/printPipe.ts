import { ModelPrinter } from '#analysis/ModelPrinter.js';
import { PipeModel } from '#model/PipeModel.js';

export function printPipe(this: ModelPrinter, model: PipeModel, indent: number) {
    this.printComments(model, indent, true);
    this.printLine(`pipe ${model.identifier} {`, indent);
    for (const config of model.configs) this.printConfig(config, indent + 1);
    for (const constant of model.constants) this.printConstant(constant, indent + 1);
    for (const enumeration of model.enums) this.printEnum(enumeration, indent + 1);
    for (const route of model.routes) this.printPipeRoute(route, indent + 1);
    this.printLine('}', indent);
}
