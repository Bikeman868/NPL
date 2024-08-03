import { Model } from '../Model.js';
import { Statement } from '../Statement.js';
import { StatementBlock } from '../StatementBlock.js';

export type ElseStatementModel = {} & Model & Statement & StatementBlock;
