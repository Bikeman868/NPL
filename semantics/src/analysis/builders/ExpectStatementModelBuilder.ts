import { IModelBuilder } from '#interfaces/IModelBuilder.js';
import { IModelFactory } from '../../interfaces/IModelFactory.js';
import { ITokenStream } from '#interfaces/ITokenStream.js';
import { extractIdentifier, skipScopeBlock } from './utils.js';
import { ExpectStatementModel } from '#model/ExpectStatementModel.js';

export class ExpectStatementModelBuilder implements IModelBuilder<ExpectStatementModel> {
    private factory: IModelFactory;
    private model: ExpectStatementModel;

    constructor(factory: IModelFactory) {
        this.factory = factory;
        this.model = factory.emptyExpectStatementModel();
    }

    build(): ExpectStatementModel {
        return this.model;
    }

    addTokens(tokens: ITokenStream): void {
        skipScopeBlock(tokens);
    }
}
