import { ModelPrinter } from '#analysis/ModelPrinter.js';
import { NetworkEgressModel } from '#model/declarative/NetworkEgressModel.js';

export function printNetworkEgress(this: ModelPrinter, model: NetworkEgressModel, indent: number) {
    this.printComments(model, indent, false);
    if (model.messageTypes.length == 0) {
        this.printLine(`egress ${model.endpointName}`, indent);
    } else if (model.messageTypes.length == 1) {
        this.printLine(`egress ${model.endpointName} ${model.messageTypes[0]}`, indent);
    } else {
        this.printLine(`egress ${model.endpointName} {`, indent);
        for (const messageType of model.messageTypes) this.printLine(messageType, indent + 1);
        this.printLine('}', indent);
    }
}
