import { ModelPrinter } from '#analysis/ModelPrinter.js';
import { EmitStatementModel } from '#model/statement/EmitStatementModel.js';

export function printEmitStatement(this: ModelPrinter, model: EmitStatementModel, indent: number) {
    this.printComments(model, indent, true);
    if (model.await) {
        this.printLine(
            `emit ${this.formatExpression(model.expression)} await ${model.await.messageType} ${
                model.await.identifier
            }`,
            indent,
        );
    } else {
        this.printLine(`emit ${this.formatExpression(model.expression)}`, indent);
    }
}
