import { IModelBuilder } from '#interfaces/IModelBuilder.js';
import { IModelFactory } from '../../interfaces/IModelFactory.js';
import { ITokenStream } from '#interfaces/ITokenStream.js';
import { extractIdentifier, skipScopeBlock } from './utils.js';
import { IfStatementModel } from '#model/IfStatementModel.js';

export class IfStatementModelBuilder implements IModelBuilder<IfStatementModel> {
    private factory: IModelFactory;
    private model: IfStatementModel;

    constructor(factory: IModelFactory) {
        this.factory = factory;
        this.model = factory.emptyIfStatementModel();
    }

    build(): IfStatementModel {
        return this.model;
    }

    addTokens(tokens: ITokenStream): void {
        skipScopeBlock(tokens);
    }
}
