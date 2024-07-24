import { IModelBuilder } from "#interfaces/IModelBuilder.js";
import { ITokenStream } from "semantics.js";
import { IModelBuilderContext } from "./IModelBuilderContext.js";
import { NamespaceModel } from "#model/NamespaceModel.js";
import { SemanticError } from "#exceptions/SemanticError.js";
import { IToken } from "npl-syntax";
import { NetworkModel } from "#model/NetworkModel.js";

export class NamespaceModelBuilder implements IModelBuilder<NamespaceModel> {
    private context: IModelBuilderContext;
    private model: NamespaceModel;

    constructor(context: IModelBuilderContext) {
        this.context = context;
        this.model = context.emptyNamespaceModel();
    }

    build(): NamespaceModel {
        return this.model;
    }

    addTokens(tokens: ITokenStream): void {
        this.buildNamespaceIdentifier(tokens);
        
        if (!this.hasScopeBlock(tokens))
            return;

        let token = tokens.next();
        while (token.tokenType != "EndScope") {
            this.buildStatement(tokens, token);
            token = tokens.next();
        }
    }

    private buildNamespaceIdentifier(tokens: ITokenStream): void {
        const token = tokens.next();
        if (token.tokenType != 'Identifier' && token.tokenType != 'QualifiedIdentifier')
            throw new SemanticError('Expecting namespace identifier', token);
        this.model.identifier = token.text;
    }

    private hasScopeBlock(tokens: ITokenStream): boolean {
        const token = tokens.next();
        tokens.moveCommentsTo(this.model.comments);

        if (token.tokenType == 'LineBreak') return false;
        if (token.tokenType == 'StartScope') return true;
        if (token.tokenType == 'Keyword') {
            this.buildStatement(tokens, token)
            return false;
        }

        throw new SemanticError('Expecting {', token);
    }

    private buildStatement(tokens: ITokenStream, token: IToken): void {
        if (token.tokenType == 'LineBreak') return;
        if (token.tokenType != 'Keyword')
            throw new SemanticError('Expecting a keyword', token)
        if (token.text == 'using')
            this.model.usings.push(this.context.buildUsingModel(tokens));
        else throw new SemanticError('Expecting using, const, config, enum, message, network or application', token);
    }
}
