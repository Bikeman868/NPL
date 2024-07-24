import { IModelBuilder } from "#interfaces/IModelBuilder.js";
import { SourceFileModel } from "#model/SourceFileModel.js";
import { ITokenStream } from "semantics.js";
import { IModelBuilderContext } from "./IModelBuilderContext.js";
import { SemanticError } from "#exceptions/SemanticError.js";
import { NamespaceModel } from "#model/NamespaceModel.js";


export class SourceFileModelBuilder implements IModelBuilder<SourceFileModel> {
    private context: IModelBuilderContext;
    private model: SourceFileModel;

    constructor(context: IModelBuilderContext) {
        this.context = context;
        this.model = context.emptySourceFileModel(); 
    }

    build(): SourceFileModel {
        return this.model;
    }

    addTokens(tokens: ITokenStream): void {
        const expecting = 'Expecting "using" or "namespace" keyword';
        while (tokens.peek()) {
            const token = tokens.next();
            if (token.tokenType == 'Keyword') {
                if (token.text == 'using') {
                    this.model.usings.push(this.context.buildUsingModel(tokens));
                } else if (token.text == 'namespace') {
                    const newNamespace = this.context.buildNamespaceModel(tokens);
                    if (this.context.config.mergeNamespaces) {
                        const existing = this.model.namespaces.find(ns => ns.identifier == newNamespace.identifier);
                        if (existing) {
                            this.context.mergeIntoNamespace(existing, newNamespace);
                        } else {
                            this.model.namespaces.push(newNamespace);
                        }
                    } else {
                        this.model.namespaces.push(newNamespace);
                    }
                } else {
                    throw new SemanticError(expecting, token);
                }
            } else if (token.tokenType != 'LineBreak' && token.tokenType != 'None') {
                throw new SemanticError(expecting, token);
            }
        }
    }
}
