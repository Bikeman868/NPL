import { IModelBuilder } from '#interfaces/IModelBuilder.js';
import { IModelFactory } from '../../interfaces/IModelFactory.js';
import { ITokenStream } from '#interfaces/ITokenStream.js';
import { SemanticError } from '#errors/SemanticError.js';
import { ConnectionModel } from '#model/ConnectionModel.js';
import { IToken } from 'npl-syntax';
import { ConnectionIngressModel } from '#model/ConnectionIngressModel.js';
import { ConnectionEgressModel } from '#model/ConnectionEgressModel.js';
import { extractIdentifier, extractQualifiedIdentifier } from './utils.js';

export class ConnectionModelBuilder implements IModelBuilder<ConnectionModel> {
    private factory: IModelFactory;
    private model: ConnectionModel;

    constructor(factory: IModelFactory) {
        this.factory = factory;
        this.model = factory.emptyConnectionModel();
    }

    build(): ConnectionModel {
        return this.model;
    }

    addTokens(tokens: ITokenStream): void {
        this.model.typeIdentifier = extractQualifiedIdentifier(tokens);
        this.model.identifier = extractIdentifier(tokens);

        if (!this.hasScopeBlock(tokens)) return;

        let token = tokens.next();
        tokens.attachCommentsTo(this.model);

        while (token.tokenType != 'EndScope') {
            if (token.tokenType != 'LineBreak') {
                if (token.tokenType != 'Keyword') throw new SemanticError('Expecting } for connection', tokens, token);
                this.buildStatement(tokens, token);
            }
            token = tokens.next();
        }

        const lineBreakToken = tokens.next();
        if (lineBreakToken.tokenType != 'LineBreak')
            throw new SemanticError('Expecting line break after connection definition', tokens, token);
    }

    private hasScopeBlock(tokens: ITokenStream): boolean {
        let token = tokens.next();
        tokens.attachCommentsTo(this.model);

        if (token.tokenType == 'LineBreak') return false;
        if (token.tokenType == 'StartScope') return true;

        while (token.tokenType == 'Keyword') {
            if (token.text == 'ingress') this.model.ingresses.push(this.buildIngressModel(tokens));
            else if (token.text == 'egress') this.model.egresses.push(this.buildEgressModel(tokens));
            else throw new SemanticError('Expecting ingress or egress', tokens, token);
            token = tokens.next();
        }
        tokens.attachCommentsTo(this.model);

        if (token.tokenType != 'LineBreak')
            throw new SemanticError('Expecting line break after connection definition', tokens, token);

        return false;
    }

    private buildStatement(tokens: ITokenStream, token: IToken): void {
        if (token.text == 'ingress') {
            const ingress = this.buildIngressModel(tokens);
            this.model.ingresses.push(ingress);
            const lineBreakToken = tokens.next();
            tokens.attachCommentsTo(ingress);
            if (lineBreakToken.tokenType != 'LineBreak')
                throw new SemanticError('Expecting line break after ingress definition', tokens, lineBreakToken);
        } else if (token.text == 'egress') {
            const egress = this.buildEgressModel(tokens);
            this.model.egresses.push(egress);
            const lineBreakToken = tokens.next();
            tokens.attachCommentsTo(egress);
            if (lineBreakToken.tokenType != 'LineBreak')
                throw new SemanticError('Expecting line break after egress definition', tokens, lineBreakToken);
        } else if (token.text == 'config') {
            this.model.configs.push(this.factory.buildConfigModel(tokens));
        } else throw new SemanticError('Expecting connection or config', tokens, token);
    }

    private buildIngressModel(tokens: ITokenStream): ConnectionIngressModel {
        const ingress = this.factory.emptyConnectionIngressModel();
        this.fillIngressEgress(tokens, ingress);
        return ingress;
    }

    private buildEgressModel(tokens: ITokenStream): ConnectionEgressModel {
        const egress = this.factory.emptyConnectionEgressModel();
        this.fillIngressEgress(tokens, egress);
        return egress;
    }

    private fillIngressEgress(tokens: ITokenStream, model: ConnectionIngressModel | ConnectionEgressModel) {
        const messageTypeToken = tokens.next();
        if (
            !(
                messageTypeToken.tokenType == 'QualifiedIdentifier' ||
                (messageTypeToken.tokenType == 'Keyword' &&
                    (messageTypeToken.text == '*' || messageTypeToken.text == 'empty'))
            )
        )
            throw new SemanticError('Expecting message type identifier, empty or *', tokens, messageTypeToken);
        model.messageType = messageTypeToken.text;

        let endpointToken = tokens.next();
        if (endpointToken.tokenType == 'StartScope') {
            while (endpointToken.tokenType != 'EndScope') {
                if (endpointToken.tokenType != 'QualifiedIdentifier')
                    throw new SemanticError('Expecting network endpoint identifier', tokens, endpointToken);
                model.networkEndpoints.push(endpointToken.text);
                endpointToken = tokens.next();
            }
        } else {
            if (endpointToken.tokenType != 'QualifiedIdentifier')
                throw new SemanticError('Expecting network endpoint identifier', tokens, endpointToken);
            model.networkEndpoints.push(endpointToken.text);
        }
    }
}
