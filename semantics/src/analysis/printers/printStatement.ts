import { ModelPrinter } from '#analysis/ModelPrinter.js';
import { ElseifStatementModel } from '#model/statement/ElseifStatementModel.js';
import { ForStatementModel } from '#model/statement/ForStatementModel.js';
import { IfStatementModel } from '#model/statement/IfStatementModel.js';
import { RouteStatementModel } from '#model/statement/RouteStatementModel.js';
import { SetStatementModel } from '#model/statement/SetStatementModel.js';
import { VarStatementModel } from '#model/statement/VarStatementModel.js';
import { WhileStatementModel } from '#model/statement/WhileStatementModel.js';
import { Statement } from '#model/Statement.js';
import { EmitStatementModel } from '#model/statement/EmitStatementModel.js';
import { ElseStatementModel } from '#model/statement/ElseStatementModel.js';
import { AppendStatementModel } from '#model/statement/AppendStatementModel.js';
import { CaptureStatementModel } from '#model/statement/CaptureStatementModel.js';
import { ClearStatementModel } from '#model/statement/ClearStatementModel.js';
import { ExpectStatementModel } from '#model/statement/ExpectStatementModel.js';
import { PrependStatementModel } from '#model/statement/PrependStatementModel.js';
import { RemoveStatementModel } from '#model/statement/RemoveStatementModel.js';

export function printStatement(this: ModelPrinter, model: Statement, indent: number) {
    switch (model.statementType) {
        case 'append':
            this.printAppendStatement(model as AppendStatementModel, indent);
        case 'capture':
            this.printCaptureStatement(model as CaptureStatementModel, indent);
        case 'clear':
            this.printClearStatement(model as ClearStatementModel, indent)    
        case 'elseif':
            this.printElseifStatement(model as ElseifStatementModel, indent);
        case 'else':
            this.printElseStatement(model as ElseStatementModel, indent);
        case 'emit':
            this.printEmitStatement(model as EmitStatementModel, indent);
        case 'expect':
            this.printExpectStatement(model as ExpectStatementModel, indent);
        case 'for':
            this.printForStatement(model as ForStatementModel, indent);
        case 'if':
            this.printIfStatement(model as IfStatementModel, indent);
        case 'prepend':
            this.printPrependStatement(model as PrependStatementModel, indent);
        case 'remove':
            this.printRemoveStatement(model as RemoveStatementModel, indent);
        case 'route':
            this.printRouteStatement(model as RouteStatementModel, indent);
        case 'set':
            this.printSetStatement(model as SetStatementModel, indent);
        case 'var':
            this.printVarStatement(model as VarStatementModel, indent);
        case 'while':
            this.printWhileStatement(model as WhileStatementModel, indent);
        default:
            throw `Statement printer does not know how to print ${model.statementType} statements`;
    }
}
