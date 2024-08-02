import { IModelBuilder } from '#interfaces/IModelBuilder.js';
import { IModelFactory } from '../../interfaces/IModelFactory.js';
import { ITokenStream } from '#interfaces/ITokenStream.js';
import { extractIdentifier, skipScopeBlock } from './utils.js';
import { CaptureStatementModel } from '#model/CaptureStatementModel.js';

export class CaptureStatementModelBuilder implements IModelBuilder<CaptureStatementModel> {
    private factory: IModelFactory;
    private model: CaptureStatementModel;

    constructor(factory: IModelFactory) {
        this.factory = factory;
        this.model = factory.emptyCaptureStatementModel();
    }

    build(): CaptureStatementModel {
        return this.model;
    }

    addTokens(tokens: ITokenStream): void {
        skipScopeBlock(tokens);
    }
}
