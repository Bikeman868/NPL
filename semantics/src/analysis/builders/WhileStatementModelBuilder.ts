import { IModelBuilder } from '#interfaces/IModelBuilder.js';
import { IModelFactory } from '../../interfaces/IModelFactory.js';
import { ITokenStream } from '#interfaces/ITokenStream.js';
import { extractIdentifier, skipScopeBlock } from './utils.js';
import { WhileStatementModel } from '#model/WhileStatementModel.js';

export class WhileStatementModelBuilder implements IModelBuilder<WhileStatementModel> {
    private factory: IModelFactory;
    private model: WhileStatementModel;

    constructor(factory: IModelFactory) {
        this.factory = factory;
        this.model = factory.emptyWhileStatementModel();
    }

    build(): WhileStatementModel {
        return this.model;
    }

    addTokens(tokens: ITokenStream): void {
        skipScopeBlock(tokens);
    }
}
