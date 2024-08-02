import { IModelBuilder } from '#interfaces/IModelBuilder.js';
import { IModelFactory } from '../../interfaces/IModelFactory.js';
import { ITokenStream } from '#interfaces/ITokenStream.js';
import { extractIdentifier, skipScopeBlock } from './utils.js';
import { ElseStatementModel } from '#model/ElseStatementModel.js';

export class ElseStatementModelBuilder implements IModelBuilder<ElseStatementModel> {
    private factory: IModelFactory;
    private model: ElseStatementModel;

    constructor(factory: IModelFactory) {
        this.factory = factory;
        this.model = factory.emptyElseStatementModel();
    }

    build(): ElseStatementModel {
        return this.model;
    }

    addTokens(tokens: ITokenStream): void {
        skipScopeBlock(tokens);
    }
}
