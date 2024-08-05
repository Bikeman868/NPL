import { IModelBuilder } from '#interfaces/IModelBuilder.js';
import { IModelFactory } from '../../interfaces/IModelFactory.js';
import { ITokenStream } from '#interfaces/ITokenStream.js';
import { extractLineBreak } from './utils.js';
import { AcceptModel } from '#model/declarative/AcceptModel.js';
import { IToken } from 'npl-syntax';
import { SemanticError } from '#errors/SemanticError.js';

export class AcceptModelBuilder implements IModelBuilder<AcceptModel> {
    private factory: IModelFactory;
    private model: AcceptModel;

    constructor(factory: IModelFactory) {
        this.factory = factory;
        this.model = factory.emptyAcceptModel();
    }

    build(): AcceptModel {
        return this.model;
    }

    addTokens(tokens: ITokenStream): void {
        this.model.messageType = this.extractMessageType(tokens);

        var token = tokens.next();
        if (token.tokenType == 'Identifier') {
            this.model.identifier = token.text;
            token = tokens.next();
        }

        if (token.tokenType == 'LineBreak') return;

        if (token.tokenType != 'StartScope') throw new SemanticError('{ or line break', tokens, token);

        token = tokens.next();
        tokens.attachCommentsTo(this.model);

        if (token.tokenType == 'EndScope') return;
        if (token.tokenType != 'LineBreak') throw new SemanticError('line break after accept {', tokens, token);

        this.buildStatements(tokens);
    }

    private extractMessageType(tokens: ITokenStream): string {
        const token = tokens.next();
        if (token.tokenType == 'Keyword') {
            if (token.text == '*' || token.text == 'empty') return token.text;
        } else if (token.tokenType == 'QualifiedIdentifier') return token.text;

        throw new SemanticError('a message type identifier', tokens, token);
    }

    private buildStatements(tokens: ITokenStream) {
        var token = tokens.next();
        while (token.tokenType != 'EndScope') {
            this.buildStatement(tokens, token);
            token = tokens.next();
        }
        extractLineBreak(tokens, '}', this.model);
    }

    buildStatement(tokens: ITokenStream, token: IToken): void {
        if (token.tokenType == 'LineBreak') return;

        if (token.tokenType != 'Keyword') throw new SemanticError('an accept statement keyword', tokens, token);

        if (token.text == 'const') this.model.constants.push(this.factory.buildConstModel(tokens));
        else if (token.text == 'config') this.model.configs.push(this.factory.buildConfigModel(tokens));
        else if (token.text == 'enum') this.model.enums.push(this.factory.buildEnumModel(tokens));
        else if (token.text == 'route') this.model.statements.push(this.factory.buildRouteStatementModel(tokens));
        else if (token.text == 'var') this.model.statements.push(this.factory.buildVarStatementModel(tokens));
        else if (token.text == 'set') this.model.statements.push(this.factory.buildSetStatementModel(tokens));
        else if (token.text == 'emit') this.model.statements.push(this.factory.buildEmitStatementModel(tokens));
        else if (token.text == 'if') this.model.statements.push(this.factory.buildIfStatementModel(tokens));
        else if (token.text == 'else') this.model.statements.push(this.factory.buildElseStatementModel(tokens));
        else if (token.text == 'elseif') this.model.statements.push(this.factory.buildElseifStatementModel(tokens));
        else if (token.text == 'while') this.model.statements.push(this.factory.buildWhileStatementModel(tokens));
        else if (token.text == 'for') this.model.statements.push(this.factory.buildForStatementModel(tokens));
        else
            throw new SemanticError(
                'const, config, enum, route, var, set, emit, if, else, endif, while or for',
                tokens,
                token,
            );
    }
}
