import { ModelPrinter } from '#analysis/ModelPrinter.js';
import { PipeRouteModel } from '#model/declarative/PipeRouteModel.js';

export function printPipeRoute(this: ModelPrinter, model: PipeRouteModel, indent: number) {
    this.printComments(model, indent, true);
    this.printLine(`route ${model.messageType} {`, indent);
    for (const statement of model.statements) this.printRoutingStatement(statement, indent + 1);
    this.printLine('}', indent);
}
