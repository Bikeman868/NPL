import { IPrinter } from "#interfaces/IPrinter.js";
import { ITokenEnumerator } from "../../../semantics/src/interfaces/ITokenStream.js";
import { IFormatter } from "#interfaces/IFormatter.js";

export interface IContext {
    getPrinter(): IPrinter;
    getTokenEnumerator(): ITokenEnumerator;
    push(formatter: IFormatter): void;
    pop(): IFormatter | undefined;
}