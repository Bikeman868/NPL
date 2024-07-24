import { IContext } from "#interfaces/IContext.js";
import { ITokenEnumerator } from "../../../semantics/src/interfaces/ITokenStream.js";
import { IPrinter, IFormatter } from "formatter.js";

export class Context implements IContext {
    private printer: IPrinter;
    private tokenEnumerator: ITokenEnumerator;

    constructor(printer: IPrinter, tokenEnumerator: ITokenEnumerator) {
        this.printer = printer;
        this.tokenEnumerator = tokenEnumerator;
    }

    getPrinter(): IPrinter {
        return this.printer;
    }

    getTokenEnumerator(): ITokenEnumerator {
        return this.tokenEnumerator;
    }


    push(formatter: IFormatter): void {
    }

    pop(): IFormatter | undefined {
        return undefined;
    }
}