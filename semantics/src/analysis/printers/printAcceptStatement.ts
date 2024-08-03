import { ModelPrinter } from '#analysis/ModelPrinter.js';
import { AcceptStatementModel } from '#model/AcceptStatementModel.js';
import { ElseifStatementModel } from '#model/statement/ElseifStatementModel.js';
import { ElseStatementModel } from '#model/ElseStatementModel.js';
import { EmitStatementModel } from '#model/EmitStatementModel.js';
import { ForStatementModel } from '#model/statement/ForStatementModel.js';
import { IfStatementModel } from '#model/statement/IfStatementModel.js';
import { RouteStatementModel } from '#model/statement/RouteStatementModel.js';
import { SetStatementModel } from '#model/statement/SetStatementModel.js';
import { VarStatementModel } from '#model/statement/VarStatementModel.js';
import { WhileStatementModel } from '#model/statement/WhileStatementModel.js';

export function printAcceptStatement(this: ModelPrinter, model: AcceptStatementModel, indent: number) {
    this.printComments(model, indent, true);
    switch (model.statementType) {
        case 'emit':
            this.printEmitStatement(model.statement as EmitStatementModel, indent + 1);
        case 'var':
            this.printVarStatement(model.statement as VarStatementModel, indent + 1);
        case 'set':
            this.printSetStatement(model.statement as SetStatementModel, indent + 1);
        case 'route':
            this.printRouteStatement(model.statement as RouteStatementModel, indent + 1);
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
            throw `Accept statement printer does not know how to print ${model.statementType} statements`;
    }
}
