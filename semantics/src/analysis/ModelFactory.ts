import { NamespaceModel } from '#model/NamespaceModel.js';
import { SourceFileModel as SourceFileModel } from '#model/SourceFileModel.js';
import { UsingModel } from '#model/UsingModel.js';
import { IModelFactory } from '../interfaces/IModelFactory.js';
import { SourceFileModelBuilder } from './builders/SourceFileModelBuilder.js';
import { NamespaceModelBuilder } from './builders/NamespaceModelBuilder.js';
import { UsingModelBuilder } from './builders/UsingModelBuilder.js';
import { NetworkModel } from '#model/NetworkModel.js';
import { ITokenStream } from '#interfaces/ITokenStream.js';
import { ApplicationModel } from '#model/ApplicationModel.js';
import { ConfigModel } from '#model/ConfigModel.js';
import { ConstModel } from '#model/ConstModel.js';
import { EnumModel } from '#model/EnumModel.js';
import { MessageTypeModel } from '#model/MessageTypeModel.js';
import { ApplicationModelBuilder } from './builders/ApplicationModelBuilder.js';
import { ConfigModelBuilder } from './builders/ConfigModelBuilder.js';
import { ConstModelBuilder } from './builders/ConstModelBuilder.js';
import { EnumModelBuilder } from './builders/EnumModelBuilder.js';
import { MessageTypeModelBuilder } from './builders/MessageTypeModelBuilder.js';
import { ConnectionModel } from '#model/ConnectionModel.js';
import { ConnectionModelBuilder } from './builders/ConnectionModelBuilder.js';
import { ConnectionIngressModel } from '#model/ConnectionIngressModel.js';
import { ConnectionEgressModel } from '#model/ConnectionEgressModel.js';
import { EnumValueModel } from '#model/EnumValueModel.js';
import { MessageFieldDefinitionModel } from '#model/MessageFieldDefinitionModel.js';
import { ConfigFieldModel } from '#model/ConfigFieldModel.js';
import { NetworkModelBuilder } from './builders/NetworkModelBuilder.js';
import { PipeModelBuilder } from './builders/PipeModelBuilder.js';
import { ProcessModelBuilder } from './builders/ProcessModelBuilder.js';
import { PipeModel } from '#model/PipeModel.js';
import { ProcessModel } from '#model/ProcessModel.js';
import { NetworkIngressModel } from '#model/NetworkIngressModel.js';
import { NetworkEgressModel } from '#model/NetworkEgressModel.js';
import { MessageDestinationModel } from '#model/MessageDestinationModel.js';

export class ModelFactory implements IModelFactory {
    public config = {
        mergeApplications: true,
        mergeSourceFiles: true,
        mergeNamespaces: true,
        mergeNetworks: true,
    };

    buildApplicationModel(tokens: ITokenStream): ApplicationModel {
        const builder = new ApplicationModelBuilder(this);
        builder.addTokens(tokens);
        return builder.build();
    }

    buildConfigModel(tokens: ITokenStream): ConfigModel {
        const builder = new ConfigModelBuilder(this);
        builder.addTokens(tokens);
        return builder.build();
    }

    buildConnectionModel(tokens: ITokenStream): ConnectionModel {
        const builder = new ConnectionModelBuilder(this);
        builder.addTokens(tokens);
        return builder.build();
    }

    buildConstModel(tokens: ITokenStream): ConstModel {
        const builder = new ConstModelBuilder(this);
        builder.addTokens(tokens);
        return builder.build();
    }

    buildEnumModel(tokens: ITokenStream): EnumModel {
        const builder = new EnumModelBuilder(this);
        builder.addTokens(tokens);
        return builder.build();
    }

    buildMessageTypeModel(tokens: ITokenStream): MessageTypeModel {
        const builder = new MessageTypeModelBuilder(this);
        builder.addTokens(tokens);
        return builder.build();
    }

    buildNamespaceModel(tokens: ITokenStream): NamespaceModel {
        const builder = new NamespaceModelBuilder(this);
        builder.addTokens(tokens);
        return builder.build();
    }

    buildNetworkModel(tokens: ITokenStream): NetworkModel {
        const builder = new NetworkModelBuilder(this);
        builder.addTokens(tokens);
        return builder.build();
    }

    buildPipeModel(tokens: ITokenStream): PipeModel {
        const builder = new PipeModelBuilder(this);
        builder.addTokens(tokens);
        return builder.build();
    }

    buildProcessModel(tokens: ITokenStream): ProcessModel {
        const builder = new ProcessModelBuilder(this);
        builder.addTokens(tokens);
        return builder.build();
    }

    buildSourceFileModel(tokens: ITokenStream): SourceFileModel {
        const builder = new SourceFileModelBuilder(this);
        builder.addTokens(tokens);
        return builder.build();
    }

    buildUsingModel(tokens: ITokenStream): UsingModel {
        const builder = new UsingModelBuilder(this);
        builder.addTokens(tokens);
        return builder.build();
    }

    emptyApplicationModel(): ApplicationModel {
        return {
            identifier: '',
            comments: [],
            configs: [],
            connections: [],
        };
    }

    emptyConfigModel(): ConfigModel {
        return {
            identifier: '',
            comments: [],
            fields: [],
        };
    }

    emptyConfigFieldModel(): ConfigFieldModel {
        return {
            fieldName: '',
            comments: [],
            expression: [],
        };
    }

    emptyConnectionModel(): ConnectionModel {
        return {
            typeIdentifier: '',
            identifier: '',
            comments: [],
            configs: [],
            ingresses: [],
            egresses: [],
        };
    }

    emptyConnectionIngressModel(): ConnectionIngressModel {
        return {
            messageType: '',
            comments: [],
            networkEndpoints: [],
        };
    }

    emptyConnectionEgressModel(): ConnectionEgressModel {
        return {
            messageType: '',
            comments: [],
            networkEndpoints: [],
        };
    }

    emptyConstModel(): ConstModel {
        return {
            identifier: '',
            comments: [],
            expression: [],
        };
    }

    emptyEnumModel(): EnumModel {
        return {
            identifier: '',
            comments: [],
            values: [],
        };
    }

    emptyEnumValueModel(): EnumValueModel {
        return {
            identifier: '',
            comments: [],
        };
    }

    emptyMessageDestinationModel(): MessageDestinationModel {
        return {
            kind: 'network',
            identifier: '',
            comments: [],
        }
    }

    emptyMessageFieldDefinitionModel(): MessageFieldDefinitionModel {
        return {
            identifier: '',
            comments: [],
            type: [],
            lifecycle: 'current',
        };
    }

    emptyMessageTypeModel(): MessageTypeModel {
        return {
            identifier: '',
            comments: [],
            fields: [],
        };
    }

    emptyNamespaceModel(): NamespaceModel {
        return {
            identifier: '',
            comments: [],
            usings: [],
            configs: [],
            messageTypes: [],
            enums: [],
            constants: [],
            networks: [],
            applications: [],
        };
    }

    emptyNetworkModel(): NetworkModel {
        return {
            identifier: '',
            comments: [],
            configs: [],
            constants: [],
            egresses: [],
            enums: [],
            ingresses: [],
            messageTypes: [],
            pipes: [],
            processes: [],
        };
    }

    emptyNetworkIngressModel(): NetworkIngressModel {
        return {
            endpointName: '',
            comments: [],
            destinations: [],
        };
    }

    emptyNetworkEgressModel(): NetworkEgressModel {
        return {
            endpointName: '',
            comments: [],
            messageTypes: [],
        };
    }

    emptyPipeModel(): PipeModel {
        return {
            identifier: '',
            comments: [],
            configs: [],
            constants: [],
            enums: [],
            routes: [],
        };
    }

    emptyProcessModel(): ProcessModel {
        return {
            identifier: '',
            comments: [],
            configs: [],
            constants: [],
            enums: [],
            messageTypes: [],
            accepts: [],
            tests: [],
        };
    }

    emptySourceFileModel(): SourceFileModel {
        return {
            comments: [],
            usings: [],
            namespaces: [],
        };
    }

    emptyUsingModel(): UsingModel {
        return {
            namespace: '',
            comments: [],
        };
    }

    mergeIntoApplication(dest: ApplicationModel, src: ApplicationModel): void {
        dest.comments = dest.comments.concat(src.comments);
        dest.configs = dest.configs.concat(src.configs);
        dest.connections = dest.connections.concat(src.connections);
    }

    mergeIntoNamespace(dest: NamespaceModel, src: NamespaceModel) {
        dest.comments = dest.comments.concat(src.comments);
        dest.configs = dest.configs.concat(src.configs);
        dest.constants = dest.constants.concat(src.constants);
        dest.usings = dest.usings.concat(src.usings);
        dest.messageTypes = dest.messageTypes.concat(src.messageTypes);
        dest.enums = dest.enums.concat(src.enums);

        if (this.config.mergeApplications) {
            for (const application of src.applications) this.addApplication(dest.applications, application);
        } else {
            dest.applications = dest.applications.concat(src.applications);
        }

        if (this.config.mergeNetworks) {
            for (const network of src.networks) this.addNetwork(dest.networks, network);
        } else {
            dest.networks = dest.networks.concat(src.networks);
        }
    }

    mergeIntoNetwork(dest: NetworkModel, src: NetworkModel) {
        dest.comments = dest.comments.concat(src.comments);
        dest.configs = dest.configs.concat(src.configs);
        dest.constants = dest.constants.concat(src.constants);
        dest.messageTypes = dest.messageTypes.concat(src.messageTypes);
        dest.enums = dest.enums.concat(src.enums);
        dest.ingresses = dest.ingresses.concat(src.ingresses);
        dest.egresses = dest.egresses.concat(src.egresses);
        dest.pipes = dest.pipes.concat(src.pipes);
        dest.processes = dest.processes.concat(src.processes);
    }

    mergeIntoSourceFile(dest: SourceFileModel, src: SourceFileModel) {
        dest.comments = dest.comments.concat(src.comments);
        dest.usings = dest.usings.concat(src.usings);

        if (this.config.mergeNamespaces) {
            for (const namespace of src.namespaces) this.addNamespace(dest.namespaces, namespace);
        } else {
            dest.namespaces = dest.namespaces.concat(src.namespaces);
        }
    }

    addApplication(applications: ApplicationModel[], application: ApplicationModel): void {
        if (this.config.mergeApplications) {
            const existing = applications.find((ns) => ns.identifier == application.identifier);
            if (existing) {
                this.mergeIntoApplication(existing, application);
            } else {
                applications.push(application);
            }
        } else {
            applications.push(application);
        }
    }

    addNamespace(namespaces: NamespaceModel[], namespace: NamespaceModel): void {
        if (this.config.mergeNamespaces) {
            const existing = namespaces.find((ns) => ns.identifier == namespace.identifier);
            if (existing) {
                this.mergeIntoNamespace(existing, namespace);
            } else {
                namespaces.push(namespace);
            }
        } else {
            namespaces.push(namespace);
        }
    }

    addNetwork(networks: NetworkModel[], network: NetworkModel): void {
        if (this.config.mergeNetworks) {
            const existing = networks.find((ns) => ns.identifier == network.identifier);
            if (existing) {
                this.mergeIntoNetwork(existing, network);
            } else {
                networks.push(network);
            }
        } else {
            networks.push(network);
        }
    }
}
