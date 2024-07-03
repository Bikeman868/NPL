import { ICommandOutput } from "./ICommandOutput.js"

export type CommandContext = {
    subCommand: String,
    options: Map<String, String>
    output: ICommandOutput
}