import { ModelPrinter } from '#analysis/ModelPrinter.js';
import { EmitStatementModel } from '#model/statement/EmitStatementModel.js';

export function printEmitStatement(this: ModelPrinter, model: EmitStatementModel, indent: number) {
    this.printComments(model, indent, true);

    this.print('emit ', indent);
    this.printExpression(model.expression, indent);
    
    if (model.await) {
        this.print(' await ', indent);
        this.print(model.await.messageType, indent);
        this.print(' ', indent);
        this.print(model.await.identifier, indent);
    }

    this.flushLine();
}
