import { IModelBuilder } from '#interfaces/IModelBuilder.js';
import { IModelFactory } from '../../interfaces/IModelFactory.js';
import { ITokenStream } from '#interfaces/ITokenStream.js';
import { extractExpression, extractIdentifier } from './utils.js';
import { SetStatementModel } from '#model/statement/SetStatementModel.js';

export class SetStatementModelBuilder implements IModelBuilder<SetStatementModel> {
    private factory: IModelFactory;
    private model: SetStatementModel;

    constructor(factory: IModelFactory) {
        this.factory = factory;
        this.model = factory.emptySetStatementModel();
    }

    build(): SetStatementModel {
        return this.model;
    }

    addTokens(tokens: ITokenStream): void {
        this.model.identifier = extractIdentifier(tokens);

        const token = tokens.next();
        tokens.attachCommentsTo(this.model);
        this.model.expression = extractExpression(tokens, token);
    }
}
