import { IPrinter } from "#interfaces/IPrinter.js";
import { EscapeType, escapeCodes } from "./consoleEscape.js";

export class ConsolePrinter implements IPrinter {
    private currentLine: string = '';
    private currentIndent = 0;
    private scopeColors: EscapeType[] = ['red', 'green', 'yellow', 'blue', 'magenta', 'cyan']

    private print(text: string, ...escapes: EscapeType[]) {
        if (!text) return;

        if (!this.currentLine) {
            for (let i = 0; i < this.currentIndent; i++)
                this.currentLine = this.currentLine + '  ';
        }
        
        for (let esc of escapes)
            this.currentLine = this.currentLine + (escapeCodes.get(esc) || '');
        
        this.currentLine = this.currentLine + text;
        
        if (escapes) this.currentLine = this.currentLine + escapeCodes.get('reset') || '';
    }

    printIdentifier(identifier: string): void {
        this.print(identifier, 'yellow');
    }
    
    printKeyword(keyword: string): void {
        this.print(keyword, 'magenta');
    }
    
    printSymbol(symbol: string): void {
        this.print(symbol, 'blue');
    }
    
    printType(type: string): void {
        this.print(type, 'green');
    }
    
    printScopeStart(): void {
        const color = this.scopeColors[this.currentIndent % this.scopeColors.length];
        this.currentIndent++;
        this.print('{', color);
    }

    printScopeEnd(): void {
        this.currentIndent--;
        const color = this.scopeColors[this.currentIndent % this.scopeColors.length];
        this.print('}', color);
    }

    printEmptyScope(): void {
        this.print('{}');
    }

    printExpression(expression: string): void {
        this.print(expression);
    }

    printComment(comment: string): void {
        this.print(comment, 'dim', 'green');
    }
    
    printNewline(): void {
        console.log(this.currentLine);
        this.currentLine = '';
    }

    printSpace(): void {
        if (this.currentLine)
            this.print(' ');
    }
}
