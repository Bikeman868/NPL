import { IModelBuilder } from '#interfaces/IModelBuilder.js';
import { IModelFactory } from '../../interfaces/IModelFactory.js';
import { ITokenStream } from '#interfaces/ITokenStream.js';
import { extractIdentifier, skipScopeBlock } from './utils.js';
import { AcceptModel } from '#model/declarative/AcceptModel.js';

export class AcceptModelBuilder implements IModelBuilder<AcceptModel> {
    private factory: IModelFactory;
    private model: AcceptModel;

    constructor(factory: IModelFactory) {
        this.factory = factory;
        this.model = factory.emptyAcceptModel();
    }

    build(): AcceptModel {
        return this.model;
    }

    addTokens(tokens: ITokenStream): void {
        this.model.identifier = extractIdentifier(tokens);
        skipScopeBlock(tokens);
    }
}
