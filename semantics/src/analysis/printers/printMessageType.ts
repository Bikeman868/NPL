import { ModelPrinter } from '#analysis/ModelPrinter.js';
import { MessageTypeModel } from '#model/declarative/MessageTypeModel.js';

export function printMessageType(this: ModelPrinter, model: MessageTypeModel, indent: number) {
    this.printComments(model, indent, true);
    if (model.fields.length == 1 && model.fields[0].comments.length == 0) {
        const field = model.fields[0];
        const fieldType = field.type.map((t) => t.text).join('');
        if (!field.lifecycle || field.lifecycle == 'current')
            this.printLine(`message ${model.identifier} ${fieldType} ${field.identifier}`, indent);
        else this.printLine(`message ${model.identifier} ${field.lifecycle} ${fieldType} ${field.identifier}`, indent);
    } else {
        this.printLine(`message ${model.identifier} {`, indent);
        for (const field of model.fields) {
            const fieldType = field.type.map((t) => t.text).join('');
            this.printComments(field, indent + 1, false);
            if (!field.lifecycle || field.lifecycle == 'current')
                this.printLine(`${fieldType} ${field.identifier}`, indent + 1);
            else this.printLine(`${field.lifecycle} ${fieldType} ${field.identifier}`, indent + 1);
        }
        this.printLine('}', indent);
    }
}
