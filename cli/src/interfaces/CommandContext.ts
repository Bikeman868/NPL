import { ICommandOutput } from '#interfaces/ICommandOutput.js';

export type CommandContext = {
    commandName: String;
    options: Map<String, String>;
    output: ICommandOutput;
};
