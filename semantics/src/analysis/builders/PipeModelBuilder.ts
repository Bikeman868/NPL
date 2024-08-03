import { IModelBuilder } from '#interfaces/IModelBuilder.js';
import { IModelFactory } from '../../interfaces/IModelFactory.js';
import { ITokenStream } from '#interfaces/ITokenStream.js';
import { extractIdentifier, skipScopeBlock } from './utils.js';
import { PipeModel } from '#model/declarative/PipeModel.js';

export class PipeModelBuilder implements IModelBuilder<PipeModel> {
    private factory: IModelFactory;
    private model: PipeModel;

    constructor(factory: IModelFactory) {
        this.factory = factory;
        this.model = factory.emptyPipeModel();
    }

    build(): PipeModel {
        return this.model;
    }

    addTokens(tokens: ITokenStream): void {
        this.model.identifier = extractIdentifier(tokens);
        skipScopeBlock(tokens);
        tokens.attachCommentsTo(this.model);
    }
}
