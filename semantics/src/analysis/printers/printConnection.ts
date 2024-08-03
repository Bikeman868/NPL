import { ModelPrinter } from '#analysis/ModelPrinter.js';
import { ConnectionModel } from '#model/declarative/ConnectionModel.js';

export function printConnection(this: ModelPrinter, model: ConnectionModel, indent: number) {
    this.printComments(model, indent);
    this.printLine(`connection ${model.typeIdentifier} ${model.identifier} {`, indent);
    for (const config of model.configs) this.printConfig(config, indent + 1);
    for (const ingress of model.ingresses) this.printConnectionIngress(ingress, indent + 1);
    for (const egress of model.egresses) this.printConnectionEgress(egress, indent + 1);
    this.printLine('}', indent);
}
