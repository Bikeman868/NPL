import { IModelBuilder } from '#interfaces/IModelBuilder.js';
import { IModelFactory } from '../../interfaces/IModelFactory.js';
import { ITokenStream } from '#interfaces/ITokenStream.js';
import { extractIdentifier, skipScopeBlock } from './utils.js';
import { AppendStatementModel } from '#model/AppendStatementModel.js';

export class AppendStatementModelBuilder implements IModelBuilder<AppendStatementModel> {
    private factory: IModelFactory;
    private model: AppendStatementModel;

    constructor(factory: IModelFactory) {
        this.factory = factory;
        this.model = factory.emptyAppendStatementModel();
    }

    build(): AppendStatementModel {
        return this.model;
    }

    addTokens(tokens: ITokenStream): void {
        skipScopeBlock(tokens);
    }
}
