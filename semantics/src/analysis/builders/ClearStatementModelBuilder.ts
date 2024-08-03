import { IModelBuilder } from '#interfaces/IModelBuilder.js';
import { IModelFactory } from '../../interfaces/IModelFactory.js';
import { ITokenStream } from '#interfaces/ITokenStream.js';
import { extractIdentifier, skipScopeBlock } from './utils.js';
import { ClearStatementModel } from '#model/statement/ClearStatementModel.js';

export class ClearStatementModelBuilder implements IModelBuilder<ClearStatementModel> {
    private factory: IModelFactory;
    private model: ClearStatementModel;

    constructor(factory: IModelFactory) {
        this.factory = factory;
        this.model = factory.emptyClearStatementModel();
    }

    build(): ClearStatementModel {
        return this.model;
    }

    addTokens(tokens: ITokenStream): void {
        skipScopeBlock(tokens);
    }
}
