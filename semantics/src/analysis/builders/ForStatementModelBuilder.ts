import { IModelBuilder } from '#interfaces/IModelBuilder.js';
import { IModelFactory } from '../../interfaces/IModelFactory.js';
import { ITokenStream } from '#interfaces/ITokenStream.js';
import { extractIdentifier, skipScopeBlock } from './utils.js';
import { ForStatementModel } from '#model/statement/ForStatementModel.js';

export class ForStatementModelBuilder implements IModelBuilder<ForStatementModel> {
    private factory: IModelFactory;
    private model: ForStatementModel;

    constructor(factory: IModelFactory) {
        this.factory = factory;
        this.model = factory.emptyForStatementModel();
    }

    build(): ForStatementModel {
        return this.model;
    }

    addTokens(tokens: ITokenStream): void {
        skipScopeBlock(tokens);
    }
}
