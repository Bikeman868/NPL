import { IModelBuilder } from '#interfaces/IModelBuilder.js';
import { IModelFactory } from '../../interfaces/IModelFactory.js';
import { ITokenStream } from '#interfaces/ITokenStream.js';
import { extractIdentifier, skipScopeBlock } from './utils.js';
import { ProcessModel } from '#model/declarative/ProcessModel.js';

export class ProcessModelBuilder implements IModelBuilder<ProcessModel> {
    private factory: IModelFactory;
    private model: ProcessModel;

    constructor(factory: IModelFactory) {
        this.factory = factory;
        this.model = factory.emptyProcessModel();
    }

    build(): ProcessModel {
        return this.model;
    }

    addTokens(tokens: ITokenStream): void {
        this.model.identifier = extractIdentifier(tokens);
        skipScopeBlock(tokens);
        tokens.attachCommentsTo(this.model);
    }
}
