import { ModelPrinter } from '#analysis/ModelPrinter.js';
import { CaptureStatementModel } from '#model/statement/CaptureStatementModel.js';

export function printCaptureStatement(this: ModelPrinter, model: CaptureStatementModel, indent: number) {
    this.printComments(model, indent, false);
    if (model.statements.length == 0) {
        this.printLine(`capture ${model.messageType}`, indent);
    } else {
        this.printLine(`capture ${model.messageType} {`, indent);
        for (const statement of model.statements) this.printStatement(statement, indent + 1);
        this.printLine('}', indent);
    }
}
