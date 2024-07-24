import { NamespaceModel } from "./NamespaceModel.js";
import { UsingModel } from "./UsingModel.js";

export type SourceFileModel = {
    comments: string[],
    usings: UsingModel[];
    namespaces: NamespaceModel[];
}
