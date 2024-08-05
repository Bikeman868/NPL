import { IModelBuilder } from '#interfaces/IModelBuilder.js';
import { IModelFactory } from '../../interfaces/IModelFactory.js';
import { ITokenStream } from '#interfaces/ITokenStream.js';
import { ConfigModel } from '#model/declarative/ConfigModel.js';
import { SemanticError } from '#errors/SemanticError.js';
import { IToken } from 'npl-syntax';
import { buildScopedStatements } from './utils.js';
import { extractExpression } from './ExpressionBuilder.js';

export class ConfigModelBuilder implements IModelBuilder<ConfigModel> {
    private factory: IModelFactory;
    private model: ConfigModel;

    constructor(factory: IModelFactory) {
        this.factory = factory;
        this.model = factory.emptyConfigModel();
    }

    build(): ConfigModel {
        return this.model;
    }

    addTokens(tokens: ITokenStream): void {
        buildScopedStatements(tokens, this.model, this);
    }

    buildStatement(tokens: ITokenStream, token: IToken): void {
        if (token.tokenType != 'Identifier') throw new SemanticError('config field name', tokens, token);

        const field = this.factory.emptyConfigFieldModel();
        field.fieldName = token.text;

        token = tokens.next();
        tokens.attachCommentsTo(field);
        field.expression = extractExpression(tokens, token);

        this.model.fields.push(field);
    }
}
