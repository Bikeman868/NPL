import { ModelPrinter } from '#analysis/ModelPrinter.js';
import { RemoveStatementModel } from '#model/statement/RemoveStatementModel.js';

export function printRemoveStatement(this: ModelPrinter, model: RemoveStatementModel, indent: number) {
    this.printComments(model, indent, true);
    if (model.destinations.length == 0) {
        this.printLine(`remove`, indent);
    } else if (model.destinations.length == 1 && model.destinations[0].comments.length == 0) {
        const destination = model.destinations[0];
        this.printLine(`remove ${destination.kind} ${destination.qualifiedIdentifier}`, indent);
    } else {
        this.printLine(`remove {`, indent);
        for (const destination of model.destinations) this.printMessageDestination(destination, indent + 1);
        this.printLine('}', indent);
    }
}
