import { IModelBuilder } from "#interfaces/IModelBuilder.js";
import { ITokenStream } from "semantics.js";
import { IModelBuilderContext } from "./IModelBuilderContext.js";
import { UsingModel } from "#model/UsingModel.js";
import { SemanticError } from "#exceptions/SemanticError.js";

export class UsingModelBuilder implements IModelBuilder<UsingModel> {
    private context: IModelBuilderContext;
    private model: UsingModel;

    constructor(context: IModelBuilderContext) {
        this.context = context;
        this.model = context.emptyUsingModel();
    }

    build(): UsingModel {
        return this.model;
    }

    addTokens(tokens: ITokenStream): void {
        let token = tokens.next();
        if (token.tokenType == 'QualifiedIdentifier') {
            this.model.namespace = token.text;
        } else {
            throw new SemanticError('Expecting a namespace name to use', token);
        }
        this.model.namespace = token.text;

        token = tokens.next();
        tokens.moveCommentsTo(this.model.comments)

        if (token.tokenType != 'LineBreak')
            throw new SemanticError('Expecting a line break', token);
    }
}
