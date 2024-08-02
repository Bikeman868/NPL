import { IModelBuilder } from '#interfaces/IModelBuilder.js';
import { IModelFactory } from '../../interfaces/IModelFactory.js';
import { ITokenStream } from '#interfaces/ITokenStream.js';
import { extractIdentifier, skipScopeBlock } from './utils.js';
import { RoutingStatementModel } from '#model/RoutingStatementModel.js';

export class RoutingStatementModelBuilder implements IModelBuilder<RoutingStatementModel> {
    private factory: IModelFactory;
    private model: RoutingStatementModel;

    constructor(factory: IModelFactory) {
        this.factory = factory;
        this.model = factory.emptyRoutingStatementModel();
    }

    build(): RoutingStatementModel {
        return this.model;
    }

    addTokens(tokens: ITokenStream): void {
        skipScopeBlock(tokens);
    }
}
