import { IModelBuilder } from '#interfaces/IModelBuilder.js';
import { IModelFactory } from '../../interfaces/IModelFactory.js';
import { ITokenStream } from '#interfaces/ITokenStream.js';
import { extractExpression } from './utils.js';
import { EmitStatementModel } from '#model/statement/EmitStatementModel.js';

export class EmitStatementModelBuilder implements IModelBuilder<EmitStatementModel> {
    private factory: IModelFactory;
    private model: EmitStatementModel;

    constructor(factory: IModelFactory) {
        this.factory = factory;
        this.model = factory.emptyEmitStatementModel();
    }

    build(): EmitStatementModel {
        return this.model;
    }

    addTokens(tokens: ITokenStream): void {
        const token = tokens.next();
        tokens.attachCommentsTo(this.model);
        this.model.expression = extractExpression(tokens, token);
    }
}
