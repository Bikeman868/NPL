import { ModelPrinter } from '#analysis/ModelPrinter.js';
import { AcceptModel } from '#model/AcceptModel.js';

export function printAccept(this: ModelPrinter, model: AcceptModel, indent: number) {
    this.printComments(model, indent, true);
    this.printLine(`accept ${model.messageType} ${model.identifier} {`, indent);
    for (const statement of model.statements) this.printAcceptStatement(statement, indent + 1);
    this.printLine('}', indent);
}
