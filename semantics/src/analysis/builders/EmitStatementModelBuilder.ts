import { IModelBuilder } from '#interfaces/IModelBuilder.js';
import { IModelFactory } from '../../interfaces/IModelFactory.js';
import { ITokenStream } from '#interfaces/ITokenStream.js';
import { EmitStatementModel } from '#model/statement/EmitStatementModel.js';
import { extractExpression } from './ExpressionBuilder.js';
import { SemanticError } from '#errors/SemanticError.js';

export class EmitStatementModelBuilder implements IModelBuilder<EmitStatementModel> {
    private factory: IModelFactory;
    private model: EmitStatementModel;

    constructor(factory: IModelFactory) {
        this.factory = factory;
        this.model = factory.emptyEmitStatementModel();
    }

    build(): EmitStatementModel {
        return this.model;
    }

    addTokens(tokens: ITokenStream): void {
        var token = tokens.next();
        tokens.attachCommentsTo(this.model);
        this.model.expression = extractExpression(tokens, token);
        
        token = tokens.next();
        if (token.tokenType == 'Keyword' && token.text =='await') {
            token = tokens.next();
            if (token.tokenType != 'QualifiedIdentifier')
                throw new SemanticError('type of message to await', tokens, token)
            const messageType = token.text;

            token = tokens.next();
            if (token.tokenType != 'Identifier')
                throw new SemanticError('identifier for the awaited message', tokens, token)

            this.model.await = {
                messageType,
                identifier: token.text,
                comments: []
            }
        } else if (token.tokenType != 'LineBreak')
            throw new SemanticError(' line break or await', tokens, token)
    }
}
