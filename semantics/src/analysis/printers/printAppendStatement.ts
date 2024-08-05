import { ModelPrinter } from '#analysis/ModelPrinter.js';
import { AppendStatementModel } from '#model/statement/AppendStatementModel.js';
import { printMessageDestination } from './printMessageDestination.js';

export function printAppendStatement(this: ModelPrinter, model: AppendStatementModel, indent: number) {
    this.printComments(model, indent, false);
    if (model.destinations.length == 0) {
        this.printLine(`append`, indent);
    } else if (model.destinations.length == 1 && model.destinations[0].comments.length == 0) {
        const destination = model.destinations[0];
        this.printLine(`append ${destination.kind} ${destination.qualifiedIdentifier}`, indent);
    } else {
        this.printLine(`append {`, indent);
        for (const destination of model.destinations) this.printMessageDestination(destination, indent + 1);
        this.printLine('}', indent);
    }
}
