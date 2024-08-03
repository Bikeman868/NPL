import { Model } from '../Model.js';
import { NamespaceModel } from './NamespaceModel.js';
import { UsingModel } from './UsingModel.js';

export type SourceFileModel = {
    usings: UsingModel[];
    namespaces: NamespaceModel[];
} & Model;
