import { IModelBuilder } from '#interfaces/IModelBuilder.js';
import { IModelFactory } from '../../interfaces/IModelFactory.js';
import { ITokenStream } from '#interfaces/ITokenStream.js';
import { buildScopedStatements, extractIdentifier, skipScopeBlock } from './utils.js';
import { ProcessModel } from '#model/declarative/ProcessModel.js';
import { IToken } from 'npl-syntax';
import { SemanticError } from '#errors/SemanticError.js';

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
        buildScopedStatements(tokens, this.model, this);
    }

    buildStatement(tokens: ITokenStream, token: IToken): void {
        if (token.tokenType != 'Keyword') throw new SemanticError('a process keyword', tokens, token);

        if (token.text == 'const') this.model.constants.push(this.factory.buildConstModel(tokens));
        else if (token.text == 'config') this.model.configs.push(this.factory.buildConfigModel(tokens));
        else if (token.text == 'enum') this.model.enums.push(this.factory.buildEnumModel(tokens));
        else if (token.text == 'message') this.model.messageTypes.push(this.factory.buildMessageTypeModel(tokens));
        else if (token.text == 'accept') this.model.accepts.push(this.factory.buildAcceptModel(tokens));
        else if (token.text == 'test') this.model.tests.push(this.factory.buildTestModel(tokens));
        else throw new SemanticError('const, config, enum, message, accept or test', tokens, token);
    }
}
