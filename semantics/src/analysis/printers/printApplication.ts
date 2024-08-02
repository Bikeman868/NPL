import { ModelPrinter } from '#analysis/ModelPrinter.js';
import { ApplicationModel } from 'semantics.js';

export function printApplication(this: ModelPrinter, model: ApplicationModel, indent: number) {
    this.printComments(model, indent, true);
    this.printLine(`application ${model.identifier} {`, indent);
    for (const config of model.configs) this.printConfig(config, indent + 1);
    for (const connection of model.connections) this.printConnection(connection, indent + 1);
    this.printLine('}', indent);
}
