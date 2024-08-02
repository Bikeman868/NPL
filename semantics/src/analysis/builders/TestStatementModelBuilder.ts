import { IModelBuilder } from '#interfaces/IModelBuilder.js';
import { IModelFactory } from '../../interfaces/IModelFactory.js';
import { ITokenStream } from '#interfaces/ITokenStream.js';
import { extractIdentifier, skipScopeBlock } from './utils.js';
import { TestStatementModel } from '#model/TestStatementModel.js';

export class TestStatementModelBuilder implements IModelBuilder<TestStatementModel> {
    private factory: IModelFactory;
    private model: TestStatementModel;

    constructor(factory: IModelFactory) {
        this.factory = factory;
        this.model = factory.emptyTestStatementModel();
    }

    build(): TestStatementModel {
        return this.model;
    }

    addTokens(tokens: ITokenStream): void {
        skipScopeBlock(tokens);
    }
}
