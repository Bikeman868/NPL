import { IModelBuilder } from '#interfaces/IModelBuilder.js';
import { IModelFactory } from '../../interfaces/IModelFactory.js';
import { ITokenStream } from '#interfaces/ITokenStream.js';
import { ApplicationModel } from '#model/ApplicationModel.js';
import { SemanticError } from '#errors/SemanticError.js';
import { IToken } from 'npl-syntax';
import { buildScopedStatements, extractIdentifier } from './utils.js';

export class ApplicationModelBuilder implements IModelBuilder<ApplicationModel> {
    private factory: IModelFactory;
    private model: ApplicationModel;

    constructor(factory: IModelFactory) {
        this.factory = factory;
        this.model = factory.emptyApplicationModel();
    }

    build(): ApplicationModel {
        return this.model;
    }

    addTokens(tokens: ITokenStream): void {
        this.model.identifier = extractIdentifier(tokens);
        buildScopedStatements(tokens, this.model, this);
    }

    buildStatement(tokens: ITokenStream, token: IToken): void {
        if (token.tokenType != 'Keyword') throw new SemanticError('Expecting a keyword', tokens, token);

        if (token.text == 'connection') this.model.connections.push(this.factory.buildConnectionModel(tokens));
        else if (token.text == 'config') this.model.configs.push(this.factory.buildConfigModel(tokens));
        else throw new SemanticError('Expecting connection or config', tokens, token);
    }
}
