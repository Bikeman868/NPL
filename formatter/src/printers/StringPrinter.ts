import { IPrinter } from "#interfaces/IPrinter.js";

export class StringPrinter implements IPrinter {
    private output: string = '';

    public getOutput(): string {
        return this.output;
    }

    printIdentifier(identifier: string): void {
    }
    printKeyword(keyword: string): void {
    }
    printSymbol(symbol: string): void {
    }
    printScopeStart(): void {
    }
    printScopeEnd(): void {
    }
    printEmptyScope(): void {
    }
    printExpression(expression: string): void {
    }
    printComment(comment: string): void {
    }
    printNewline(): void {
    }
    printType(type: string): void {
    }
    printSpace(): void {
    }
}
