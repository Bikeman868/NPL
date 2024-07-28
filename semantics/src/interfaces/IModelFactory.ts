import { ITokenStream } from '#interfaces/ITokenStream.js';
import { ApplicationModel } from '#model/ApplicationModel.js';
import { ConfigFieldModel } from '#model/ConfigFieldModel.js';
import { ConfigModel } from '#model/ConfigModel.js';
import { ConnectionEgressModel } from '#model/ConnectionEgressModel.js';
import { ConnectionIngressModel } from '#model/ConnectionIngressModel.js';
import { ConnectionModel } from '#model/ConnectionModel.js';
import { ConstModel } from '#model/ConstModel.js';
import { EnumModel } from '#model/EnumModel.js';
import { EnumValueModel } from '#model/EnumValueModel.js';
import { MessageDestinationModel } from '#model/MessageDestinationModel.js';
import { MessageFieldDefinitionModel } from '#model/MessageFieldDefinitionModel.js';
import { MessageTypeModel } from '#model/MessageTypeModel.js';
import { NamespaceModel } from '#model/NamespaceModel.js';
import { NetworkEgressModel } from '#model/NetworkEgressModel.js';
import { NetworkIngressModel } from '#model/NetworkIngressModel.js';
import { NetworkModel } from '#model/NetworkModel.js';
import { PipeModel } from '#model/PipeModel.js';
import { ProcessModel } from '#model/ProcessModel.js';
import { SourceFileModel } from '#model/SourceFileModel.js';
import { UsingModel } from '#model/UsingModel.js';

export interface IModelFactory {
    config: {
        mergeSourceFiles: boolean;
        mergeNamespaces: boolean;
        mergeNetworks: boolean;
        mergeApplications: boolean;
    };

    buildApplicationModel(tokens: ITokenStream): ApplicationModel;
    buildConfigModel(tokens: ITokenStream): ConfigModel;
    buildConnectionModel(tokens: ITokenStream): ConnectionModel;
    buildConstModel(tokens: ITokenStream): ConstModel;
    buildEnumModel(tokens: ITokenStream): EnumModel;
    buildMessageTypeModel(tokens: ITokenStream): MessageTypeModel;
    buildNamespaceModel(tokens: ITokenStream): NamespaceModel;
    buildNetworkModel(tokens: ITokenStream): NetworkModel;
    buildPipeModel(tokens: ITokenStream): PipeModel;
    buildProcessModel(tokens: ITokenStream): ProcessModel;
    buildSourceFileModel(tokens: ITokenStream): SourceFileModel;
    buildUsingModel(tokens: ITokenStream): UsingModel;

    emptyApplicationModel(): ApplicationModel;
    emptyConfigFieldModel(): ConfigFieldModel;
    emptyConfigModel(): ConfigModel;
    emptyConnectionEgressModel(): ConnectionEgressModel;
    emptyConnectionIngressModel(): ConnectionIngressModel;
    emptyConnectionModel(): ConnectionModel;
    emptyConstModel(): ConstModel;
    emptyEnumModel(): EnumModel;
    emptyEnumValueModel(): EnumValueModel;
    emptyMessageDestinationModel(): MessageDestinationModel;
    emptyMessageFieldDefinitionModel(): MessageFieldDefinitionModel;
    emptyMessageTypeModel(): MessageTypeModel;
    emptyNamespaceModel(): NamespaceModel;
    emptyNetworkModel(): NetworkModel;
    emptyNetworkIngressModel(): NetworkIngressModel;
    emptyNetworkEgressModel(): NetworkEgressModel;
    emptyPipeModel(): PipeModel;
    emptyProcessModel(): ProcessModel;
    emptySourceFileModel(): SourceFileModel;
    emptyUsingModel(): UsingModel;

    mergeIntoApplication(dest: ApplicationModel, src: ApplicationModel): void;
    mergeIntoNamespace(dest: NamespaceModel, src: NamespaceModel): void;
    mergeIntoNetwork(dest: NetworkModel, src: NetworkModel): void;
    mergeIntoSourceFile(dest: SourceFileModel, src: SourceFileModel): void;

    addApplication(applications: ApplicationModel[], application: ApplicationModel): void;
    addNamespace(namespaces: NamespaceModel[], namespace: NamespaceModel): void;
    addNetwork(networks: NetworkModel[], network: NetworkModel): void;
}
