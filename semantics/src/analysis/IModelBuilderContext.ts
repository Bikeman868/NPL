import { ITokenStream } from "#interfaces/ITokenStream.js";
import { NamespaceModel } from "#model/NamespaceModel.js";
import { NetworkModel } from "#model/NetworkModel.js";
import { SourceFileModel } from "#model/SourceFileModel.js";
import { UsingModel } from "#model/UsingModel.js";

export interface IModelBuilderContext {
    config: {
        mergeSourceFiles: boolean;
        mergeNamespaces: boolean;
        mergeNetworks: boolean;
    }

    buildSourceFileModel(tokens: ITokenStream): SourceFileModel;
    buildNamespaceModel(tokens: ITokenStream): NamespaceModel;
    buildUsingModel(tokens: ITokenStream): UsingModel;

    emptySourceFileModel(): SourceFileModel;
    emptyNamespaceModel(): NamespaceModel;
    emptyUsingModel(): UsingModel;

    mergeIntoSourceFile(dest: SourceFileModel, src: SourceFileModel): void;
    mergeIntoNamespace(dest: NamespaceModel, src: NamespaceModel): void;
    mergeIntoNetwork(dest: NetworkModel, src: NetworkModel): void;
}
