import { IModelBuilder } from '#interfaces/IModelBuilder.js';
import { IModelFactory } from '../../interfaces/IModelFactory.js';
import { NamespaceModel } from '#model/declarative/NamespaceModel.js';
import { SemanticError } from '#errors/SemanticError.js';
import { IToken } from 'npl-syntax';
import { ITokenStream } from '#interfaces/ITokenStream.js';
import { buildScopedStatements, extractQualifiedIdentifier, hasScopeBlock } from './utils.js';

export class NamespaceModelBuilder implements IModelBuilder<NamespaceModel> {
    private factory: IModelFactory;
    private model: NamespaceModel;

    constructor(factory: IModelFactory) {
        this.factory = factory;
        this.model = factory.emptyNamespaceModel();
    }

    build(): NamespaceModel {
        return this.model;
    }

    addTokens(tokens: ITokenStream): void {
        this.model.identifier = extractQualifiedIdentifier(tokens);
        buildScopedStatements(tokens, this.model, this);
    }

    buildStatement(tokens: ITokenStream, token: IToken): void {
        if (token.tokenType != 'Keyword') throw new SemanticError('a keyword', tokens, token);

        if (token.text == 'using') this.model.usings.push(this.factory.buildUsingModel(tokens));
        else if (token.text == 'const') this.model.constants.push(this.factory.buildConstModel(tokens));
        else if (token.text == 'config') this.model.configs.push(this.factory.buildConfigModel(tokens));
        else if (token.text == 'enum') this.model.enums.push(this.factory.buildEnumModel(tokens));
        else if (token.text == 'message') this.model.messageTypes.push(this.factory.buildMessageTypeModel(tokens));
        else if (token.text == 'network')
            this.factory.addNetwork(this.model.networks, this.factory.buildNetworkModel(tokens));
        else if (token.text == 'application')
            this.factory.addApplication(this.model.applications, this.factory.buildApplicationModel(tokens));
        else throw new SemanticError('using, const, config, enum, message, network or application', tokens, token);
    }
}
