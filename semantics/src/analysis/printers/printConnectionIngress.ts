import { ModelPrinter } from '#analysis/ModelPrinter.js';
import { ConnectionIngressModel } from '#model/declarative/ConnectionIngressModel.js';

export function printConnectionIngress(this: ModelPrinter, model: ConnectionIngressModel, indent: number) {
    this.printComments(model, indent);
    if (model.networkEndpoints.length == 1) {
        this.printLine(`ingress ${model.messageType} ${model.networkEndpoints[0]}`, indent);
    } else {
        this.printLine(`ingress ${model.messageType} {`, indent);
        for (const endpoint of model.networkEndpoints) {
            this.printLine(endpoint, indent + 1);
        }
        this.printLine('}', indent);
    }
}
