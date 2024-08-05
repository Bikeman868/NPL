import { IModelBuilder } from '#interfaces/IModelBuilder.js';
import { IModelFactory } from '../../interfaces/IModelFactory.js';
import { ITokenStream } from '#interfaces/ITokenStream.js';
import { extractQualifiedIdentifier, skipScopeBlock } from './utils.js';
import { RouteStatementModel } from '#model/statement/RouteStatementModel.js';

export class RouteStatementModelBuilder implements IModelBuilder<RouteStatementModel> {
    private factory: IModelFactory;
    private model: RouteStatementModel;

    constructor(factory: IModelFactory) {
        this.factory = factory;
        this.model = factory.emptyRouteStatementModel();
    }

    build(): RouteStatementModel {
        return this.model;
    }

    addTokens(tokens: ITokenStream): void {
        this.model.identifier = extractQualifiedIdentifier(tokens);
        skipScopeBlock(tokens);
    }
}