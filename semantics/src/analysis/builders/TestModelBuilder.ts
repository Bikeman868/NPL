import { IModelBuilder } from '#interfaces/IModelBuilder.js';
import { IModelFactory } from '../../interfaces/IModelFactory.js';
import { ITokenStream } from '#interfaces/ITokenStream.js';
import { extractIdentifier, skipScopeBlock } from './utils.js';
import { TestModel } from '#model/declarative/TestModel.js';

export class TestModelBuilder implements IModelBuilder<TestModel> {
    private factory: IModelFactory;
    private model: TestModel;

    constructor(factory: IModelFactory) {
        this.factory = factory;
        this.model = factory.emptyTestModel();
    }

    build(): TestModel {
        return this.model;
    }

    addTokens(tokens: ITokenStream): void {
        const token = tokens.peek();
        if (token?.tokenType == 'StringLiteral') {
            this.model.name = token.text;
            tokens.next();
        }

        skipScopeBlock(tokens);
    }
}
