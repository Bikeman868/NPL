import { Statement } from './Statement.js';

// Models that contain a list of statements to execute in sequence
export type StatementBlock = {
    statements: Statement[];
};
