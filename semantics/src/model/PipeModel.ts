import { ConfigModel } from "./ConfigModel.js";
import { ConstModel } from "./ConstModel.js";
import { EnumModel } from "./EnumModel.js";
import { PipeRouteModel } from "./PipeRouteModel.js";

export type PipeModel = {
    identifier: string;
    comments: string[];
    constants: ConstModel[];
    enums: EnumModel[];
    configs: ConfigModel[];
    routes: PipeRouteModel[];
};
