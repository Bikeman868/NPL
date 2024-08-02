import { ModelPrinter } from '#analysis/ModelPrinter.js';
import { NamespaceModel } from '#model/NamespaceModel.js';

export function printNamespace(this: ModelPrinter, model: NamespaceModel, indent: number) {
    this.printComments(model, indent, true);
    this.printLine(`namespace ${model.identifier} {`, indent);
    for (const using of model.usings) this.printUsing(using, indent + 1);
    for (const constant of model.constants) this.printConstant(constant, indent + 1);
    for (const application of model.applications) this.printApplication(application, indent + 1);
    for (const messageType of model.messageTypes) this.printMessageType(messageType, indent + 1);
    for (const network of model.networks) this.printNetwork(network, indent + 1);
    for (const enumeration of model.enums) this.printEnum(enumeration, indent + 1);
    this.printLine('}', indent);
}
