import { ModelPrinter } from '#analysis/ModelPrinter.js';
import { RouteStatementModel } from '#model/statement/RouteStatementModel.js';

export function printRouteStatement(this: ModelPrinter, model: RouteStatementModel, indent: number) {
    this.printComments(model, indent);
    this.printLine('route {', indent);
    for (const statement of model.statements) this.printStatement(statement, indent);
    this.printLine('}', indent);
    model.statements;
}
