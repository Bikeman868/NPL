import { ModelPrinter } from '#analysis/ModelPrinter.js';
import { PrependStatementModel } from '#model/statement/PrependStatementModel.js';

export function printPrependStatement(this: ModelPrinter, model: PrependStatementModel, indent: number) {
    this.printComments(model, indent, true);
    if (model.destinations.length == 0) {
        this.printLine(`prepend`, indent);
    } else if (model.destinations.length == 1 && model.destinations[0].comments.length == 0) {
        const destination = model.destinations[0];
        this.printLine(`prepend ${destination.kind} ${destination.qualifiedIdentifier}`, indent);
    } else {
        this.printLine(`prepend {`, indent);
        for (const destination of model.destinations) this.printMessageDestination(destination, indent + 1);
        this.printLine('}', indent);
    }
}
