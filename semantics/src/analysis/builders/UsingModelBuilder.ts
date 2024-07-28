import { IModelBuilder } from '#interfaces/IModelBuilder.js';
import { ITokenStream } from 'semantics.js';
import { IModelFactory } from '../../interfaces/IModelFactory.js';
import { UsingModel } from '#model/UsingModel.js';
import { extractLineBreak, extractQualifiedIdentifier } from './utils.js';

export class UsingModelBuilder implements IModelBuilder<UsingModel> {
    private factory: IModelFactory;
    private model: UsingModel;

    constructor(factory: IModelFactory) {
        this.factory = factory;
        this.model = factory.emptyUsingModel();
    }

    build(): UsingModel {
        return this.model;
    }

    addTokens(tokens: ITokenStream): void {
        this.model.namespace = extractQualifiedIdentifier(tokens);
        extractLineBreak(tokens, 'namespace identifier', this.model);
    }
}
