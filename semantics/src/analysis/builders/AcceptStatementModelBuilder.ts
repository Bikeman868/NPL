import { IModelBuilder } from '#interfaces/IModelBuilder.js';
import { IModelFactory } from '../../interfaces/IModelFactory.js';
import { ITokenStream } from '#interfaces/ITokenStream.js';
import { extractIdentifier, skipScopeBlock } from './utils.js';
import { AcceptStatementModel } from '#model/AcceptStatementModel.js';

export class AcceptStatementModelBuilder implements IModelBuilder<AcceptStatementModel> {
    private factory: IModelFactory;
    private model: AcceptStatementModel;

    constructor(factory: IModelFactory) {
        this.factory = factory;
        this.model = factory.emptyAcceptStatementModel();
    }

    build(): AcceptStatementModel {
        return this.model;
    }

    addTokens(tokens: ITokenStream): void {
        skipScopeBlock(tokens);
    }
}
