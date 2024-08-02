import { IModelBuilder } from '#interfaces/IModelBuilder.js';
import { IModelFactory } from '../../interfaces/IModelFactory.js';
import { ITokenStream } from '#interfaces/ITokenStream.js';
import { NetworkModel } from '#model/NetworkModel.js';
import { buildScopedStatements, extractIdentifier, extractLineBreak, extractQualifiedIdentifier } from './utils.js';
import { IToken } from 'npl-syntax';
import { SemanticError } from '#errors/SemanticError.js';
import { NetworkIngressModel } from '#model/NetworkIngressModel.js';
import { NetworkEgressModel } from '#model/NetworkEgressModel.js';
import { DestinationKind, MessageDestinationModel } from '#model/MessageDestinationModel.js';
import { ModelFactory } from 'semantics.js';

export class NetworkModelBuilder implements IModelBuilder<NetworkModel> {
    private factory: IModelFactory;
    private model: NetworkModel;

    constructor(factory: IModelFactory) {
        this.factory = factory;
        this.model = factory.emptyNetworkModel();
    }

    build(): NetworkModel {
        return this.model;
    }

    addTokens(tokens: ITokenStream): void {
        this.model.identifier = extractIdentifier(tokens);
        buildScopedStatements(tokens, this.model, this);
    }

    buildStatement(tokens: ITokenStream, token: IToken): void {
        if (token.tokenType != 'Keyword')
            throw new SemanticError('Expecting a netwoek statement keyword', tokens, token);

        if (token.text == 'const') this.model.constants.push(this.factory.buildConstModel(tokens));
        else if (token.text == 'config') this.model.configs.push(this.factory.buildConfigModel(tokens));
        else if (token.text == 'enum') this.model.enums.push(this.factory.buildEnumModel(tokens));
        else if (token.text == 'message') this.model.messageTypes.push(this.factory.buildMessageTypeModel(tokens));
        else if (token.text == 'pipe') this.model.pipes.push(this.factory.buildPipeModel(tokens));
        else if (token.text == 'process') this.model.processes.push(this.factory.buildProcessModel(tokens));
        else if (token.text == 'ingress') this.model.ingresses.push(this.buildNetworkIngressModel(tokens));
        else if (token.text == 'egress') this.model.egresses.push(this.buildNetworkEgressModel(tokens));
        else
            throw new SemanticError(
                'Expecting const config, enum, message, ingress egress, pipe or process',
                tokens,
                token,
            );
    }

    private buildNetworkIngressModel(tokens: ITokenStream): NetworkIngressModel {
        const model = this.factory.emptyNetworkIngressModel();

        model.endpointName = this.buildNetworkEntryPointName(tokens);

        let token = tokens.next();
        if (token.tokenType == 'StartScope') {
            extractLineBreak(tokens, 'network ingress {', model);
            token = tokens.next();
            while (token.tokenType != 'EndScope') {
                model.destinations.push(this.buildDestination(tokens, token));
                token = tokens.next();
            }
            extractLineBreak(tokens, 'network ingress }', model);
        } else {
            tokens.attachCommentsTo(this.model);
            model.destinations.push(this.buildDestination(tokens, token));
        }

        return model;
    }

    private buildDestination(tokens: ITokenStream, token: IToken): MessageDestinationModel {
        const destination = this.factory.emptyMessageDestinationModel();

        if (token.tokenType != 'Keyword')
            throw new SemanticError('Expecting a destination type keyword', tokens, token);

        if (token.text == 'network' || token.text == 'process' || token.text == 'pipe') destination.kind = token.text;
        else throw new SemanticError('Expecting process, pipe or network keyword', tokens, token);

        destination.identifier = extractQualifiedIdentifier(tokens);
        extractLineBreak(tokens, 'message destination', destination);

        return destination;
    }

    private buildNetworkEgressModel(tokens: ITokenStream): NetworkEgressModel {
        const model = this.factory.emptyNetworkEgressModel();

        model.endpointName = this.buildNetworkEntryPointName(tokens);

        let token = tokens.next();
        if (token.tokenType == 'StartScope') {
            extractLineBreak(tokens, 'network egress {', model);
            token = tokens.next();
            while (token.tokenType != 'EndScope') {
                model.messageTypes.push(this.buildMessageType(tokens, token));
                token = tokens.next();
                while (token.tokenType == 'LineBreak') token = tokens.next();
            }
        } else {
            model.messageTypes.push(this.buildMessageType(tokens, token));
        }

        extractLineBreak(tokens, 'network egress', model);
        tokens.attachCommentsTo(this.model);

        return model;
    }

    private buildMessageType(tokens: ITokenStream, token: IToken): string {
        if (token.tokenType == 'Keyword') {
            if (token.text == '*' || token.text == 'empty') return token.text;
        }

        if (token.tokenType == 'QualifiedIdentifier') return token.text;

        throw new SemanticError('Expecting a message type identifier', tokens, token);
    }

    private buildNetworkEntryPointName(tokens: ITokenStream): string {
        const nameToken = tokens.next();
        if (nameToken.tokenType == 'Identifier') return nameToken.text;

        if (nameToken.tokenType == 'Keyword' && nameToken.text == 'default') return 'default';

        throw new SemanticError('Expecting network entry point name or "default"', tokens, nameToken);
    }
}
