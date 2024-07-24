export interface IPrinter {
    printIdentifier(identifier: string): void;
    printKeyword(keyword: string): void;
    printSymbol(symbol: string): void;
    printScopeStart(): void;
    printScopeEnd(): void;
    printEmptyScope(): void;
    printExpression(expression: string): void;
    printComment(comment: string): void;
    printNewline(): void;
    printSpace(): void;
    printType(type: string): void;
}