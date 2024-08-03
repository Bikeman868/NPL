import { ModelPrinter } from '#analysis/ModelPrinter.js';
import { NetworkIngressModel } from '#model/declarative/NetworkIngressModel.js';

export function printNetworkIngress(this: ModelPrinter, model: NetworkIngressModel, indent: number) {
    this.printComments(model, indent, false);
    if (model.destinations.length == 0) {
        this.printLine(`ingress ${model.endpointName}`, indent);
    } else if (model.destinations.length == 1) {
        const destination = model.destinations[0];
        this.printLine(`ingress ${model.endpointName} ${destination.kind} ${destination.identifier}`, indent);
    } else {
        this.printLine(`ingress ${model.endpointName} {`, indent);
        for (const destination of model.destinations)
            this.printLine(`${destination.kind} ${destination.identifier}`, indent + 1);
        this.printLine('}', indent);
    }
}
