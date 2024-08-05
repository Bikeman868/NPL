import { IModelBuilder } from '#interfaces/IModelBuilder.js';
import { IModelFactory } from '../../interfaces/IModelFactory.js';
import { ITokenStream } from '#interfaces/ITokenStream.js';
import { extractExpression, skipScopeBlock } from './utils.js';
import { ElseifStatementModel } from '#model/statement/ElseifStatementModel.js';

export class ElseifStatementModelBuilder implements IModelBuilder<ElseifStatementModel> {
    private factory: IModelFactory;
    private model: ElseifStatementModel;

    constructor(factory: IModelFactory) {
        this.factory = factory;
        this.model = factory.emptyElseifStatementModel();
    }

    build(): ElseifStatementModel {
        return this.model;
    }

    addTokens(tokens: ITokenStream): void {
        const token = tokens.next();
        tokens.attachCommentsTo(this.model);
        this.model.expression = extractExpression(tokens, token);
        skipScopeBlock(tokens);
    }
}
