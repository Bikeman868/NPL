import { IModelBuilder } from '#interfaces/IModelBuilder.js';
import { IModelFactory } from '../../interfaces/IModelFactory.js';
import { ITokenStream } from '#interfaces/ITokenStream.js';
import { EnumModel } from '#model/EnumModel.js';
import { extractIdentifier, extractLineBreak, skipScopeBlock } from './utils.js';
import { EnumValueModel } from '#model/EnumValueModel.js';
import { SemanticError } from '#errors/SemanticError.js';

export class EnumModelBuilder implements IModelBuilder<EnumModel> {
    private factory: IModelFactory;
    private model: EnumModel;

    constructor(factory: IModelFactory) {
        this.factory = factory;
        this.model = factory.emptyEnumModel();
    }

    build(): EnumModel {
        return this.model;
    }

    addTokens(tokens: ITokenStream): void {
        this.model.identifier = extractIdentifier(tokens);

        let token = tokens.next();
        if (token.tokenType == 'LineBreak') {
            tokens.attachCommentsTo(this.model);
        } else if (token.tokenType == 'StartScope') {
            extractLineBreak(tokens, 'enum {', this.model);
            token = tokens.next();
            while (token.tokenType != 'EndScope') {
                if (token.tokenType == 'Identifier') {
                    const enumValue: EnumValueModel = {
                        identifier: token.text,
                        comments: [],
                    };
                    extractLineBreak(tokens, 'enum value', enumValue);
                    this.model.values.push(enumValue);
                }
                token = tokens.next();
            }
            extractLineBreak(tokens, 'enum }', this.model);
        } else if (token.tokenType == 'Identifier') {
            tokens.attachCommentsTo(this.model);
            while (token.tokenType != 'LineBreak') {
                if (token.tokenType != 'Identifier')
                    throw new SemanticError('Expecting an enum value identifier', tokens, token);
                const enumValue: EnumValueModel = {
                    identifier: token.text,
                    comments: [],
                };
                token = tokens.next();
                tokens.attachCommentsTo(enumValue);
                this.model.values.push(enumValue);
            }
        } else {
            throw new SemanticError('Expecting a list of enum values', tokens, token);
        }
    }
}
