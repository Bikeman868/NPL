import { IModelBuilder } from '#interfaces/IModelBuilder.js';
import { IModelFactory } from '../../interfaces/IModelFactory.js';
import { ITokenStream } from '#interfaces/ITokenStream.js';
import { ConstModel } from '#model/declarative/ConstModel.js';
import { extractExpression, extractIdentifier } from './utils.js';

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
        const token = tokens.next();
        tokens.attachCommentsTo(this.model);
        this.model.expression = extractExpression(tokens, token);
    }
}
