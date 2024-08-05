import { IModelBuilder } from '#interfaces/IModelBuilder.js';
import { IModelFactory } from '../../interfaces/IModelFactory.js';
import { ITokenStream } from '#interfaces/ITokenStream.js';
import { skipScopeBlock } from './utils.js';
import { IfStatementModel } from '#model/statement/IfStatementModel.js';
import { extractExpression } from './ExpressionBuilder.js';

export class IfStatementModelBuilder implements IModelBuilder<IfStatementModel> {
    private factory: IModelFactory;
    private model: IfStatementModel;

    constructor(factory: IModelFactory) {
        this.factory = factory;
        this.model = factory.emptyIfStatementModel();
    }

    build(): IfStatementModel {
        return this.model;
    }

    addTokens(tokens: ITokenStream): void {
        const token = tokens.next();
        tokens.attachCommentsTo(this.model);
        this.model.expression = extractExpression(tokens, token);
        skipScopeBlock(tokens);
    }
}
