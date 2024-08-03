import { ModelPrinter } from '#analysis/ModelPrinter.js';
import { TestModel } from '#model/declarative/TestModel.js';

export function printTest(this: ModelPrinter, model: TestModel, indent: number) {
    this.printComments(model, indent, true);
    this.printLine(`test '' {`, indent);
    for (const statement of model.statements) this.printTestStatement(statement, indent + 1);
    this.printLine('}', indent);
}
