import { ModelPrinter } from '#analysis/ModelPrinter.js';
import { AppendStatementModel } from '#model/AppendStatementModel.js';
import { CaptureStatementModel } from '#model/CaptureStatementModel.js';
import { ClearStatementModel } from '#model/ClearStatementModel.js';
import { ElseifStatementModel } from '#model/ElseifStatementModel.js';
import { ElseStatementModel } from '#model/ElseStatementModel.js';
import { ForStatementModel } from '#model/ForStatementModel.js';
import { IfStatementModel } from '#model/IfStatementModel.js';
import { PrependStatementModel } from '#model/PrependStatementModel.js';
import { RemoveStatementModel } from '#model/RemoveStatementModel.js';
import { RoutingStatementModel } from '#model/RoutingStatementModel.js';
import { WhileStatementModel } from '#model/WhileStatementModel.js';

export function printRoutingStatement(this: ModelPrinter, model: RoutingStatementModel, indent: number) {
    this.printComments(model, indent, true);
    switch (model.statementType) {
        case 'append':
            this.printAppendStatement(model.statement as AppendStatementModel, indent + 1);
        case 'prepend':
            this.printPrependStatement(model.statement as PrependStatementModel, indent + 1);
        case 'clear':
            this.printClearStatement(model.statement as ClearStatementModel, indent + 1);
        case 'capture':
            this.printCaptureStatement(model.statement as CaptureStatementModel, indent + 1);
        case 'remove':
            this.printRemoveStatement(model.statement as RemoveStatementModel, indent + 1);
        case 'if':
            this.printIfStatement(model.statement as IfStatementModel, indent + 1);
        case 'else':
            this.printElseStatement(model.statement as ElseStatementModel, indent + 1);
        case 'elseif':
            this.printElseifStatement(model.statement as ElseifStatementModel, indent + 1);
        case 'while':
            this.printWhileStatement(model.statement as WhileStatementModel, indent + 1);
        case 'for':
            this.printForStatement(model.statement as ForStatementModel, indent + 1);
        default:
            throw `Pipe route printer does not know how to print ${model.statementType} statements`;
    }
}
