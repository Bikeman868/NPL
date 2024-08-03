import { IModelBuilder } from '#interfaces/IModelBuilder.js';
import { IModelFactory } from '../../interfaces/IModelFactory.js';
import { ITokenStream } from '#interfaces/ITokenStream.js';
import { extractIdentifier, skipScopeBlock } from './utils.js';
import { RemoveStatementModel } from '#model/statement/RemoveStatementModel.js';

export class RemoveStatementModelBuilder implements IModelBuilder<RemoveStatementModel> {
    private factory: IModelFactory;
    private model: RemoveStatementModel;

    constructor(factory: IModelFactory) {
        this.factory = factory;
        this.model = factory.emptyRemoveStatementModel();
    }

    build(): RemoveStatementModel {
        return this.model;
    }

    addTokens(tokens: ITokenStream): void {
        skipScopeBlock(tokens);
    }
}
