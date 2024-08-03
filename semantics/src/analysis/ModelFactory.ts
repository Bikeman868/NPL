import { NamespaceModel } from '#model/declarative/NamespaceModel.js';
import { SourceFileModel as SourceFileModel } from '#model/declarative/SourceFileModel.js';
import { UsingModel } from '#model/declarative/UsingModel.js';
import { IModelFactory } from '../interfaces/IModelFactory.js';
import { SourceFileModelBuilder } from './builders/SourceFileModelBuilder.js';
import { NamespaceModelBuilder } from './builders/NamespaceModelBuilder.js';
import { UsingModelBuilder } from './builders/UsingModelBuilder.js';
import { NetworkModel } from '#model/declarative/NetworkModel.js';
import { ITokenStream } from '#interfaces/ITokenStream.js';
import { ApplicationModel } from '#model/declarative/ApplicationModel.js';
import { ConfigModel } from '#model/declarative/ConfigModel.js';
import { ConstModel } from '#model/declarative/ConstModel.js';
import { EnumModel } from '#model/declarative/EnumModel.js';
import { MessageTypeModel } from '#model/declarative/MessageTypeModel.js';
import { ApplicationModelBuilder } from './builders/ApplicationModelBuilder.js';
import { ConfigModelBuilder } from './builders/ConfigModelBuilder.js';
import { ConstModelBuilder } from './builders/ConstModelBuilder.js';
import { EnumModelBuilder } from './builders/EnumModelBuilder.js';
import { MessageTypeModelBuilder } from './builders/MessageTypeModelBuilder.js';
import { ConnectionModel } from '#model/declarative/ConnectionModel.js';
import { ConnectionModelBuilder } from './builders/ConnectionModelBuilder.js';
import { ConnectionIngressModel } from '#model/declarative/ConnectionIngressModel.js';
import { ConnectionEgressModel } from '#model/declarative/ConnectionEgressModel.js';
import { EnumValueModel } from '#model/declarative/EnumValueModel.js';
import { MessageFieldDefinitionModel } from '#model/declarative/MessageFieldDefinitionModel.js';
import { ConfigFieldModel } from '#model/declarative/ConfigFieldModel.js';
import { NetworkModelBuilder } from './builders/NetworkModelBuilder.js';
import { PipeModelBuilder } from './builders/PipeModelBuilder.js';
import { ProcessModelBuilder } from './builders/ProcessModelBuilder.js';
import { PipeModel } from '#model/declarative/PipeModel.js';
import { ProcessModel } from '#model/declarative/ProcessModel.js';
import { NetworkIngressModel } from '#model/declarative/NetworkIngressModel.js';
import { NetworkEgressModel } from '#model/declarative/NetworkEgressModel.js';
import { MessageDestinationModel } from '#model/declarative/MessageDestinationModel.js';
import { AcceptModel } from '#model/declarative/AcceptModel.js';
import { AcceptModelBuilder } from './builders/AcceptModelBuilder.js';
import { CaptureStatementModel } from '#model/statement/CaptureStatementModel.js';
import { AppendStatementModel } from '#model/statement/AppendStatementModel.js';
import { ClearStatementModel } from '#model/statement/ClearStatementModel.js';
import { ElseifStatementModel } from '#model/statement/ElseifStatementModel.js';
import { ExpectStatementModel } from '#model/statement/ExpectStatementModel.js';
import { ForStatementModel } from '#model/statement/ForStatementModel.js';
import { IfStatementModel } from '#model/statement/IfStatementModel.js';
import { PrependStatementModel } from '#model/statement/PrependStatementModel.js';
import { RemoveStatementModel } from '#model/statement/RemoveStatementModel.js';
import { RouteStatementModel } from '#model/statement/RouteStatementModel.js';
import { SetStatementModel } from '#model/statement/SetStatementModel.js';
import { VarStatementModel } from '#model/statement/VarStatementModel.js';
import { WhileStatementModel } from '#model/statement/WhileStatementModel.js';
import { AppendStatementModelBuilder } from './builders/AppendStatementModelBuilder.js';
import { CaptureStatementModelBuilder } from './builders/CaptureStatementModelBuilder.js';
import { ClearStatementModelBuilder } from './builders/ClearStatementModelBuilder.js';
import { ElseifStatementModelBuilder } from './builders/ElseifStatementModelBuilder.js';
import { ElseStatementModelBuilder } from './builders/ElseStatementModelBuilder.js';
import { EmitStatementModelBuilder } from './builders/EmitStatementModelBuilder.js';
import { ExpectStatementModelBuilder } from './builders/ExpectStatementModelBuilder.js';
import { ForStatementModelBuilder } from './builders/ForStatementModelBuilder.js';
import { IfStatementModelBuilder } from './builders/IfStatementModelBuilder.js';
import { RemoveStatementModelBuilder } from './builders/RemoveStatementModelBuilder.js';
import { RouteStatementModelBuilder } from './builders/RouteStatementModelBuilder.js';
import { TestModelBuilder } from './builders/TestModelBuilder.js';
import { SetStatementModelBuilder } from './builders/SetStatementModelBuilder.js';
import { VarStatementModelBuilder } from './builders/VarStatementModelBuilder.js';
import { WhileStatementModelBuilder } from './builders/WhileStatementModelBuilder.js';
import { PipeRouteModel } from '#model/declarative/PipeRouteModel.js';
import { PipeRouteModelBuilder } from './builders/PipeRouteModelBuilder.js';
import { ElseStatementModel } from '#model/statement/ElseStatementModel.js';
import { EmitStatementModel } from '#model/statement/EmitStatementModel.js';
import { TestModel } from '#model/declarative/TestModel.js';

export class ModelFactory implements IModelFactory {
    public config = {
        mergeApplications: true,
        mergeSourceFiles: true,
        mergeNamespaces: true,
        mergeNetworks: true,
    };

    buildAcceptModel(tokens: ITokenStream): AcceptModel {
        const builder = new AcceptModelBuilder(this);
        builder.addTokens(tokens);
        return builder.build();
    }

    buildAppendStatementModel(tokens: ITokenStream): AppendStatementModel {
        const builder = new AppendStatementModelBuilder(this);
        builder.addTokens(tokens);
        return builder.build();
    }

    buildApplicationModel(tokens: ITokenStream): ApplicationModel {
        const builder = new ApplicationModelBuilder(this);
        builder.addTokens(tokens);
        return builder.build();
    }

    buildCaptureStatementModel(tokens: ITokenStream): CaptureStatementModel {
        const builder = new CaptureStatementModelBuilder(this);
        builder.addTokens(tokens);
        return builder.build();
    }

    buildClearStatementModel(tokens: ITokenStream): ClearStatementModel {
        const builder = new ClearStatementModelBuilder(this);
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

    buildElseifStatementModel(tokens: ITokenStream): ElseifStatementModel {
        const builder = new ElseifStatementModelBuilder(this);
        builder.addTokens(tokens);
        return builder.build();
    }

    buildElseStatementModel(tokens: ITokenStream): ElseStatementModel {
        const builder = new ElseStatementModelBuilder(this);
        builder.addTokens(tokens);
        return builder.build();
    }

    buildEmitStatementModel(tokens: ITokenStream): EmitStatementModel {
        const builder = new EmitStatementModelBuilder(this);
        builder.addTokens(tokens);
        return builder.build();
    }

    buildEnumModel(tokens: ITokenStream): EnumModel {
        const builder = new EnumModelBuilder(this);
        builder.addTokens(tokens);
        return builder.build();
    }

    buildExpectStatementModel(tokens: ITokenStream): ExpectStatementModel {
        const builder = new ExpectStatementModelBuilder(this);
        builder.addTokens(tokens);
        return builder.build();
    }

    buildForStatementModel(tokens: ITokenStream): ForStatementModel {
        const builder = new ForStatementModelBuilder(this);
        builder.addTokens(tokens);
        return builder.build();
    }

    buildIfStatementModel(tokens: ITokenStream): IfStatementModel {
        const builder = new IfStatementModelBuilder(this);
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

    buildPipeRouteModel(tokens: ITokenStream): PipeRouteModel {
        const builder = new PipeRouteModelBuilder(this);
        builder.addTokens(tokens);
        return builder.build();
    }

    buildProcessModel(tokens: ITokenStream): ProcessModel {
        const builder = new ProcessModelBuilder(this);
        builder.addTokens(tokens);
        return builder.build();
    }

    buildRemoveStatementModel(tokens: ITokenStream): RemoveStatementModel {
        const builder = new RemoveStatementModelBuilder(this);
        builder.addTokens(tokens);
        return builder.build();
    }

    buildRouteStatementModel(tokens: ITokenStream): RouteStatementModel {
        const builder = new RouteStatementModelBuilder(this);
        builder.addTokens(tokens);
        return builder.build();
    }

    buildSetStatementModel(tokens: ITokenStream): SetStatementModel {
        const builder = new SetStatementModelBuilder(this);
        builder.addTokens(tokens);
        return builder.build();
    }

    buildSourceFileModel(tokens: ITokenStream): SourceFileModel {
        const builder = new SourceFileModelBuilder(this);
        builder.addTokens(tokens);
        return builder.build();
    }

    buildTestModel(tokens: ITokenStream): TestModel {
        const builder = new TestModelBuilder(this);
        builder.addTokens(tokens);
        return builder.build();
    }

    buildUsingModel(tokens: ITokenStream): UsingModel {
        const builder = new UsingModelBuilder(this);
        builder.addTokens(tokens);
        return builder.build();
    }

    buildVarStatementModel(tokens: ITokenStream): VarStatementModel {
        const builder = new VarStatementModelBuilder(this);
        builder.addTokens(tokens);
        return builder.build();
    }

    buildWhileStatementModel(tokens: ITokenStream): WhileStatementModel {
        const builder = new WhileStatementModelBuilder(this);
        builder.addTokens(tokens);
        return builder.build();
    }

    emptyAcceptModel(): AcceptModel {
        return {
            identifier: '',
            comments: [],
            messageType: '',
            statements: [],
        };
    }

    emptyAppendStatementModel(): AppendStatementModel {
        return {
            statementType: 'append',
            comments: [],
            destinations: [],
        };
    }

    emptyApplicationModel(): ApplicationModel {
        return {
            identifier: '',
            comments: [],
            configs: [],
            connections: [],
        };
    }

    emptyCaptureStatementModel(): CaptureStatementModel {
        return {
            statementType: 'capture',
            comments: [],
            messageType: '',
            statements: [],
        };
    }

    emptyClearStatementModel(): ClearStatementModel {
        return {
            statementType: 'clear',
            comments: [],
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

    emptyElseifStatementModel(): ElseifStatementModel {
        return {
            statementType: 'elseif',
            comments: [],
            expression: [],
            statements: [],
        };
    }

    emptyElseStatementModel(): ElseStatementModel {
        return {
            statementType: 'else',
            comments: [],
            statements: [],
        };
    }
    emptyEmitStatementModel(): EmitStatementModel {
        return {
            statementType: 'emit',
            comments: [],
            expression: [],
            await: undefined,
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

    emptyExpectStatementModel(): ExpectStatementModel {
        return {
            statementType: 'expect',
            comments: [],
            expression: [],
        };
    }

    emptyForStatementModel(): ForStatementModel {
        return {
            statementType: 'for',
            comments: [],
            identifier: '',
            iterationType: 'values',
            expression: [],
            statements: [],
        };
    }

    emptyIfStatementModel(): IfStatementModel {
        return {
            statementType: 'if',
            comments: [],
            expression: [],
            statements: [],
        };
    }

    emptyMessageDestinationModel(): MessageDestinationModel {
        return {
            kind: undefined,
            qualifiedIdentifier: '',
            comments: [],
        };
    }

    emptyMessageFieldDefinitionModel(): MessageFieldDefinitionModel {
        return {
            identifier: '',
            comments: [],
            type: [],
            lifecycle: undefined,
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

    emptyPipeRouteModel(): PipeRouteModel {
        return {
            messageType: '',
            comments: [],
            statements: [],
        };
    }

    emptyPrependStatementModel(): PrependStatementModel {
        return {
            statementType: 'prepend',
            comments: [],
            destinations: [],
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

    emptyRemoveStatementModel(): RemoveStatementModel {
        return {
            statementType: 'remove',
            comments: [],
            destinations: [],
        };
    }

    emptyRouteStatementModel(): RouteStatementModel {
        return {
            statementType: 'route',
            comments: [],
            statements: [],
        };
    }

    emptySetStatementModel(): SetStatementModel {
        return {
            statementType: 'set',
            comments: [],
            identifier: '',
            expression: [],
        };
    }

    emptySourceFileModel(): SourceFileModel {
        return {
            comments: [],
            usings: [],
            namespaces: [],
        };
    }

    emptyTestModel(): TestModel {
        return {
            name: '',
            comments: [],
            statements: [],
        };
    }

    emptyUsingModel(): UsingModel {
        return {
            namespace: '',
            comments: [],
        };
    }

    emptyVarStatementModel(): VarStatementModel {
        return {
            statementType: 'var',
            comments: [],
            identifier: '',
            expression: [],
        };
    }

    emptyWhileStatementModel(): WhileStatementModel {
        return {
            statementType: 'while',
            comments: [],
            expression: [],
            statements: [],
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
