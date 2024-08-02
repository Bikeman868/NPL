import { IModelBuilder } from '#interfaces/IModelBuilder.js';
import { IModelFactory } from '../../interfaces/IModelFactory.js';
import { ITokenStream } from '#interfaces/ITokenStream.js';
import { extractIdentifier, skipScopeBlock } from './utils.js';
import { SetStatementModel } from '#model/SetStatementModel.js';

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
        skipScopeBlock(tokens);
    }
}
