import { IModelBuilder } from '#interfaces/IModelBuilder.js';
import { SourceFileModel } from '#model/declarative/SourceFileModel.js';
import { ITokenStream } from 'semantics.js';
import { IModelFactory } from '../../interfaces/IModelFactory.js';
import { SemanticError } from '#errors/SemanticError.js';

export class SourceFileModelBuilder implements IModelBuilder<SourceFileModel> {
    private factory: IModelFactory;
    private model: SourceFileModel;

    constructor(factory: IModelFactory) {
        this.factory = factory;
        this.model = factory.emptySourceFileModel();
    }

    build(): SourceFileModel {
        return this.model;
    }

    addTokens(tokens: ITokenStream): void {
        const expecting = 'using or namespace keyword';
        while (tokens.peek()) {
            const token = tokens.next();
            if (token.tokenType == 'Keyword') {
                if (token.text == 'using') {
                    this.model.usings.push(this.factory.buildUsingModel(tokens));
                } else if (token.text == 'namespace') {
                    const newNamespace = this.factory.buildNamespaceModel(tokens);
                    this.factory.addNamespace(this.model.namespaces, newNamespace);
                } else {
                    throw new SemanticError(expecting, tokens, token);
                }
            } else if (token.tokenType != 'LineBreak' && token.tokenType != 'None') {
                throw new SemanticError(expecting, tokens, token);
            }
        }
    }
}
