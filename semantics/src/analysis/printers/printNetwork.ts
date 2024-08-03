import { ModelPrinter } from '#analysis/ModelPrinter.js';
import { NetworkModel } from '#model/declarative/NetworkModel.js';

export function printNetwork(this: ModelPrinter, model: NetworkModel, indent: number) {
    this.printComments(model, indent, true);
    this.printLine(`network ${model.identifier} {`, indent);
    for (const config of model.configs) this.printConfig(config, indent + 1);
    for (const ingress of model.ingresses) this.printNetworkIngress(ingress, indent + 1);
    for (const egress of model.egresses) this.printNetworkEgress(egress, indent + 1);
    for (const constant of model.constants) this.printConstant(constant, indent + 1);
    for (const messageType of model.messageTypes) this.printMessageType(messageType, indent + 1);
    for (const pipe of model.pipes) this.printPipe(pipe, indent + 1);
    for (const process of model.processes) this.printProcess(process, indent + 1);
    for (const enumeration of model.enums) this.printEnum(enumeration, indent + 1);
    this.printLine('}', indent);
}
