import { IModelBuilder } from '#interfaces/IModelBuilder.js';
import { IModelFactory } from '../../interfaces/IModelFactory.js';
import { ITokenStream } from '#interfaces/ITokenStream.js';
import { extractExpression, skipScopeBlock } from './utils.js';
import { WhileStatementModel } from '#model/statement/WhileStatementModel.js';

export class WhileStatementModelBuilder implements IModelBuilder<WhileStatementModel> {
    private factory: IModelFactory;
    private model: WhileStatementModel;

    constructor(factory: IModelFactory) {
        this.factory = factory;
        this.model = factory.emptyWhileStatementModel();
    }

    build(): WhileStatementModel {
        return this.model;
    }

    addTokens(tokens: ITokenStream): void {
        const token = tokens.next();
        tokens.attachCommentsTo(this.model);
        this.model.expression = extractExpression(tokens, token);

        skipScopeBlock(tokens);
    }
}
