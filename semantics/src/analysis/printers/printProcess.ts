import { ModelPrinter } from '#analysis/ModelPrinter.js';
import { ProcessModel } from '#model/ProcessModel.js';

export function printProcess(this: ModelPrinter, model: ProcessModel, indent: number) {
    this.printComments(model, indent, true);
    this.printLine(`process ${model.identifier} {`, indent);
    for (const config of model.configs) this.printConfig(config, indent + 1);
    for (const constant of model.constants) this.printConstant(constant, indent + 1);
    for (const messageType of model.messageTypes) this.printMessageType(messageType, indent + 1);
    for (const enumeration of model.enums) this.printEnum(enumeration, indent + 1);
    for (const accept of model.accepts) this.printAccept(accept, indent + 1);
    for (const test of model.tests) this.printTest(test, indent + 1);
    this.printLine('}', indent);
}
