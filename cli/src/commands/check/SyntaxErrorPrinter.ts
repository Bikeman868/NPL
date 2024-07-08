import { ICommandOutput } from "#interfaces/ICommandOutput.js";

/**
 * Prints a source file with syntax errors.
 */
export class SyntaxErrorPrinter {
    private output: ICommandOutput;
    private includeStateStack: boolean = false;
    private includeMultipleErrorsOnSameLine: boolean = false;

    constructor(
        output: ICommandOutput,
        includeStateStack: boolean,
        includeMultipleErrorsOnSameLine: boolean) {
        this.output = output;
        this.includeStateStack = includeStateStack;
        this.includeMultipleErrorsOnSameLine = includeMultipleErrorsOnSameLine;
    }

    private eol() {
        this.output.flushLine();
    }

    private writeSpaces(count: number) {
        this.output.writeBody(' '.repeat(count));
    }

    private write(text: string) {
        this.output.writeBody(text);
    }

    private writeError(text: string) {
        this.output.writeColor(text, 'red');
    }

    private writeLineNumber(lineNumber: number) {
        this.output.writeColor(('0000' + lineNumber).slice(-4), 'cyan');
    }

    private writeBlankLine() {
        this.output.writeBodyLine('');
    }

    print(sourceFileText: string, syntaxErrors: any[], linesToPrint: number) {
        const sourceLines = sourceFileText.split('\n');

        let syntaxErrorIndex = 0;
        let error = syntaxErrors[syntaxErrorIndex];
        const lineNumberWidth = 4;

        let lineNumber = 1;
        for (const sourceLine of sourceLines) {
            if (error && lineNumber > error.line - linesToPrint) {
                this.writeLineNumber(lineNumber);
                this.write(' ');
                this.write(sourceLine);
                this.eol();
            }

            while (error?.line == lineNumber) {
                const indent = lineNumberWidth + error.column;
                this.writeSpaces(indent);
                this.writeError('^ ' + error.message);

                if (this.includeStateStack) {
                    this.write(' @ ' + error.state);
                    this.eol();
                    this.writeBlankLine();
                } else {
                    this.eol();
                }

                if (this.includeMultipleErrorsOnSameLine) error = syntaxErrors[++syntaxErrorIndex];
                else while (error?.line == lineNumber) error = syntaxErrors[++syntaxErrorIndex];
            }

            lineNumber++;
        }
    }
}
