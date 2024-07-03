import { ICommandOutput } from '#interfaces/ICommandOutput.js';
import { Option } from './Option.js';

export type CommandContext = {
    commandName: String;
    options: Map<String, Option>;
    output: ICommandOutput;
};
