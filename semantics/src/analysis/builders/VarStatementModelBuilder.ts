import { IModelBuilder } from '#interfaces/IModelBuilder.js';
import { IModelFactory } from '../../interfaces/IModelFactory.js';
import { ITokenStream } from '#interfaces/ITokenStream.js';
import { extractIdentifier } from './utils.js';
import { VarStatementModel } from '#model/statement/VarStatementModel.js';
import { extractExpression } from './ExpressionBuilder.js';

export class VarStatementModelBuilder implements IModelBuilder<VarStatementModel> {
    private factory: IModelFactory;
    private model: VarStatementModel;

    constructor(factory: IModelFactory) {
        this.factory = factory;
        this.model = factory.emptyVarStatementModel();
    }

    build(): VarStatementModel {
        return this.model;
    }

    addTokens(tokens: ITokenStream): void {
        this.model.identifier = extractIdentifier(tokens);

        const token = tokens.next();
        tokens.attachCommentsTo(this.model);
        this.model.expression = extractExpression(tokens, token);
    }
}
