import { NamespaceModel } from "#model/NamespaceModel.js";
import { SourceFileModel as SourceFileModel } from "#model/SourceFileModel.js";
import { UsingModel } from "#model/UsingModel.js";
import { ITokenStream } from "semantics.js";
import { IModelBuilderContext } from "./IModelBuilderContext.js";
import { SourceFileModelBuilder } from "./SourceFileModelBuilder.js";
import { NamespaceModelBuilder } from "./NamespaceModelBuilder.js";
import { UsingModelBuilder } from "./UsingModelBuilder.js";
import { NetworkModel } from "#model/NetworkModel.js";

export class ModelBuilderContext implements IModelBuilderContext {
    public config = {
        mergeSourceFiles: true,
        mergeNamespaces: true,
        mergeNetworks: true,
    }

    buildSourceFileModel(tokens: ITokenStream): SourceFileModel {
        const builder = new SourceFileModelBuilder(this);
        builder.addTokens(tokens);
        return builder.build();
    }

    buildNamespaceModel(tokens: ITokenStream): NamespaceModel {
        const builder = new NamespaceModelBuilder(this);
        builder.addTokens(tokens);
        return builder.build();
    }
    
    buildUsingModel(tokens: ITokenStream): UsingModel {
        const builder = new UsingModelBuilder(this);
        builder.addTokens(tokens);
        return builder.build();
    }

    emptySourceFileModel(): SourceFileModel {
        return {
            comments: [],
            usings: [],
            namespaces: [],
        }
    }

    emptyNamespaceModel(): NamespaceModel {
        return {
            identifier: '',
            comments: [],
            usings: [],
            configs: [],
            messages: [],
            enums: [],
            constants: [],
            networks: [],
            applications: [],
        }
    }

    emptyUsingModel(): UsingModel {
        return {
            namespace: '',
            comments: [],
        }
    }

    mergeIntoSourceFile(dest: SourceFileModel, src: SourceFileModel) {
        dest.comments = dest.comments.concat(src.comments);
        dest.usings = dest.usings.concat(src.usings);

        // TODO: merge namespaces
        dest.namespaces = dest.namespaces.concat(src.namespaces);
    }

    mergeIntoNamespace(dest: NamespaceModel, src: NamespaceModel) {
        dest.comments = dest.comments.concat(src.comments);
        dest.usings = dest.usings.concat(src.usings);
        dest.configs = dest.configs.concat(src.configs);
        dest.messages = dest.messages.concat(src.messages);
        dest.enums = dest.enums.concat(src.enums);
        dest.constants = dest.constants.concat(src.constants);
        dest.applications = dest.applications.concat(src.applications);

        // TODO: Merge networks
        dest.networks = dest.messages.concat(src.networks);
    }

    mergeIntoNetwork(dest: NetworkModel, src: NetworkModel) {
    }
}
