import { IModelBuilder } from '#interfaces/IModelBuilder.js';
import { IModelFactory } from '../../interfaces/IModelFactory.js';
import { ITokenStream } from '#interfaces/ITokenStream.js';
import { MessageTypeModel } from '#model/MessageTypeModel.js';
import { buildScopedStatements, extractIdentifier } from './utils.js';
import { SemanticError } from '#errors/SemanticError.js';
import { IToken } from 'npl-syntax';
import { MessageFieldDefinitionModel } from 'semantics.js';

export class MessageTypeModelBuilder implements IModelBuilder<MessageTypeModel> {
    private factory: IModelFactory;
    private model: MessageTypeModel;

    constructor(factory: IModelFactory) {
        this.factory = factory;
        this.model = factory.emptyMessageTypeModel();
    }

    build(): MessageTypeModel {
        return this.model;
    }

    addTokens(tokens: ITokenStream): void {
        this.model.identifier = extractIdentifier(tokens);
        buildScopedStatements(tokens, this.model, this);
    }

    buildStatement(tokens: ITokenStream, token: IToken): void {
        const field = this.factory.emptyMessageFieldDefinitionModel();
        this.model.fields.push(field);

        token = this.buildFieldLifecycle(tokens, token, field);
        token = this.buildFieldType(tokens, token, field);
        token = this.buildFieldIdentifier(tokens, token, field);

        if (token.tokenType != 'LineBreak')
            throw new SemanticError('Expecting line break after field identifier', tokens, token);

        tokens.attachCommentsTo(field);
    }

    buildFieldType(tokens: ITokenStream, token: IToken, field: MessageFieldDefinitionModel): IToken {
        while(token.tokenType == 'Type' || token.tokenType == 'StartGeneric' || token.tokenType == 'EndGeneric') {
            field.type.push(token);
            token = tokens.next();
        }
        if (field.type.length == 0) throw new SemanticError('Expecting field type', tokens, token);
        
        return token;
    }

    buildFieldLifecycle(tokens: ITokenStream, token: IToken, field: MessageFieldDefinitionModel): IToken {
        if (token.tokenType != 'Keyword') return token;

        if (token.text == 'new') field.lifecycle = 'new';
        else if (token.text == 'deprecated') field.lifecycle = 'deprecated';

        return tokens.next();
    }

    buildFieldIdentifier(tokens: ITokenStream, token: IToken, field: MessageFieldDefinitionModel): IToken {
        if (token.tokenType != 'Identifier') throw new SemanticError('Expecting a field name', tokens, token);
        field.identifier = token.text;
        return tokens.next();
    }
}
