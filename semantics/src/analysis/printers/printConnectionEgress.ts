import { ModelPrinter } from '#analysis/ModelPrinter.js';
import { ConnectionEgressModel } from '#model/ConnectionEgressModel.js';

export function printConnectionEgress(this: ModelPrinter, model: ConnectionEgressModel, indent: number) {
    this.printComments(model, indent);
    if (model.networkEndpoints.length == 1) {
        this.printLine(`egress ${model.messageType} ${model.networkEndpoints[0]}`, indent);
    } else {
        this.printLine(`egress ${model.messageType} {`, indent);
        for (const endpoint of model.networkEndpoints) {
            this.printLine(endpoint, indent + 1);
        }
        this.printLine('}', indent);
    }
}
