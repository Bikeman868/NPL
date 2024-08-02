import { AppendStatementModel } from './AppendStatementModel.js';
import { ClearStatementModel } from './ClearStatementModel.js';
import { ElseifStatementModel } from './ElseifStatementModel.js';
import { ElseStatementModel } from './ElseStatementModel.js';
import { ForStatementModel } from './ForStatementModel.js';
import { IfStatementModel } from './IfStatementModel.js';
import { PrependStatementModel } from './PrependStatementModel.js';
import { RemoveStatementModel } from './RemoveStatementModel.js';
import { WhileStatementModel } from './WhileStatementModel.js';

export type RoutingStatementModel = {
    comments: string[];
    statementType:
        | undefined
        | 'append'
        | 'prepend'
        | 'clear'
        | 'capture'
        | 'remove'
        | 'if'
        | 'else'
        | 'elseif'
        | 'while'
        | 'for';
    statement:
        | undefined
        | AppendStatementModel
        | PrependStatementModel
        | ClearStatementModel
        | AppendStatementModel
        | RemoveStatementModel
        | IfStatementModel
        | ElseStatementModel
        | ElseifStatementModel
        | WhileStatementModel
        | ForStatementModel;
};
