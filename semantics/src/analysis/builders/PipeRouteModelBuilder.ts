import { IModelBuilder } from '#interfaces/IModelBuilder.js';
import { IModelFactory } from '../../interfaces/IModelFactory.js';
import { ITokenStream } from '#interfaces/ITokenStream.js';
import { extractIdentifier, skipScopeBlock } from './utils.js';
import { PipeRouteModel } from '#model/PipeRouteModel.js';

export class PipeRouteModelBuilder implements IModelBuilder<PipeRouteModel> {
    private factory: IModelFactory;
    private model: PipeRouteModel;

    constructor(factory: IModelFactory) {
        this.factory = factory;
        this.model = factory.emptyPipeRouteModel();
    }

    build(): PipeRouteModel {
        return this.model;
    }

    addTokens(tokens: ITokenStream): void {
        skipScopeBlock(tokens);
    }
}
