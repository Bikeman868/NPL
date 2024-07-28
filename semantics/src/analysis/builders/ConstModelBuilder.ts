import { IModelBuilder } from '#interfaces/IModelBuilder.js';
import { IModelFactory } from '../../interfaces/IModelFactory.js';
import { ITokenStream } from '#interfaces/ITokenStream.js';
import { ConstModel } from '#model/ConstModel.js';
import { buildExpression, extractIdentifier } from './utils.js';

export class ConstModelBuilder implements IModelBuilder<ConstModel> {
    private factory: IModelFactory;
    private model: ConstModel;

    constructor(factory: IModelFactory) {
        this.factory = factory;
        this.model = factory.emptyConstModel();
    }

    build(): ConstModel {
        return this.model;
    }

    addTokens(tokens: ITokenStream): void {
        this.model.identifier = extractIdentifier(tokens);
        buildExpression(tokens, this.model);
    }
}
