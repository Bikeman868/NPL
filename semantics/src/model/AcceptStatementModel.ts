import { ElseifStatementModel } from "./ElseifStatementModel.js";
import { ElseStatementModel } from "./ElseStatementModel.js";
import { EmitStatementModel } from "./EmitStatementModel.js";
import { ForStatementModel } from "./ForStatementModel.js";
import { IfStatementModel } from "./IfStatementModel.js";
import { SetStatementModel } from "./SetStatementModel.js";
import { VarStatementModel } from "./VarStatementModel.js";
import { WhileStatementModel } from "./WhileStatementModel.js";
import {RouteStatementModel } from "./RouteStatementModel.js";

export type AcceptStatementModel = {
    comments: string[];
    statementType: 
        'emit' | 
        'var' | 
        'set' | 
        'route' | 
        'if' | 
        'else' | 
        'elseif' | 
        'while' | 
        'for';
    statement: 
        EmitStatementModel | 
        VarStatementModel |
        SetStatementModel | 
        RouteStatementModel |
        IfStatementModel |
        ElseStatementModel |
        ElseifStatementModel |
        WhileStatementModel |
        ForStatementModel;
};
