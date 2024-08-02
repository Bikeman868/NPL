import { IModelBuilder } from '#interfaces/IModelBuilder.js';
import { IModelFactory } from '../../interfaces/IModelFactory.js';
import { ITokenStream } from '#interfaces/ITokenStream.js';
import { extractIdentifier, skipScopeBlock } from './utils.js';
import { VarStatementModel } from '#model/VarStatementModel.js';

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
        skipScopeBlock(tokens);
    }
}
