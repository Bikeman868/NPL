import { IToken, TokenType } from 'npl-syntax';
import { printAccept } from './printers/printAccept.js';
import { printAppendStatement } from './printers/printAppendStatement.js';
import { printApplication } from './printers/printApplication.js';
import { printCaptureStatement } from './printers/printCaptureStatement.js';
import { printClearStatement } from './printers/printClearStatement.js';
import { printConfigField } from './printers/printConfigField.js';
import { printConfig } from './printers/printConfig.js';
import { printConnectionEgress } from './printers/printConnectionEgress.js';
import { printConnectionIngress } from './printers/printConnectionIngress.js';
import { printConnection } from './printers/printConnection.js';
import { printConstant } from './printers/printConstant.js';
import { printElseifStatement } from './printers/printElseifStatement.js';
import { printElseStatement } from './printers/printElseStatement.js';
import { printEmitStatement } from './printers/printEmitStatement.js';
import { printEnum } from './printers/printEnum.js';
import { printEnumValue } from './printers/printEnumValue.js';
import { printExpectStatement } from './printers/printExpectStatement.js';
import { printForStatement } from './printers/printForStatement.js';
import { printIfStatement } from './printers/printIfStatement.js';
import { printMessageDestination } from './printers/printMessageDestination.js';
import { printMessageFieldDefinition } from './printers/printMessageFieldDefinition.js';
import { printMessageType } from './printers/printMessageType.js';
import { printNamespace } from './printers/printNamespace.js';
import { printNetworkEgress } from './printers/printNetworkEgress.js';
import { printNetworkIngress } from './printers/printNetworkIngress.js';
import { printNetwork } from './printers/printNetwork.js';
import { printPipe } from './printers/printPipe.js';
import { printPipeRoute } from './printers/printPipeRoute.js';
import { printPrependStatement } from './printers/printPrependStatement.js';
import { printProcess } from './printers/printProcess.js';
import { printRemoveStatement } from './printers/printRemoveStatement.js';
import { printRouteStatement } from './printers/printRouteStatement.js';
import { printSetStatement } from './printers/printSetStatement.js';
import { printSourceFile } from './printers/printSourceFile.js';
import { printTest } from './printers/printTest.js';
import { printUsing } from './printers/printUsing.js';
import { printVarStatement } from './printers/printVarStatement.js';
import { printWhileStatement } from './printers/printWhileStatement.js';
import { printStatement } from './printers/printStatement.js';

// This class is internal to this package, because it is intended for testing an debugging
// code within this package. There is an npl-formatter package that can output formatted
// code, but it depends on this package, making development awkward. This class lets us
// quickly print any model to check for correct behavior
export class ModelPrinter {
    // Utility functions

    protected printLine(line: string, indent: number): void {
        console.log('  '.repeat(indent) + line);
    }

    protected printBlankLine() {
        console.log();
    }

    protected printComment(comment: string, indent: number) {
        if (comment.indexOf('\n') >= 0) {
            this.printLine('/*', indent);
            for (const line of comment.split('\n')) this.printLine(line.trim(), indent + 1);
            this.printLine('*/', indent);
        } else {
            this.printLine(`// ${comment}`, indent);
        }
    }

    protected printComments(
        model: { comments: string[] },
        indent: number,
        alwaysPrintBlankLine: boolean = false,
    ): boolean {
        if (!model || !model.comments.length) {
            if (alwaysPrintBlankLine) this.printBlankLine();
            return false;
        }

        this.printBlankLine();

        for (const comment of model.comments) this.printComment(comment, indent);

        return true;
    }

    protected printLineBreakIfComments(model: { comments: string[] }): void {
        if (model.comments.length) this.printBlankLine();
    }

    protected formatExpression(expression: IToken[]): string {
        const typesToPrintText: TokenType[] = [
            'StringLiteral',
            'Identifier',
            'QualifiedIdentifier',
            'BooleanLiteral',
            'Keyword',
            'Type',
            'StartMessageLiteral',
        ];

        let result = '';
        for (const token of expression) {
            if (token.tokenType in typesToPrintText) result += `${token.tokenType} (${token.text}) `;
            else result += `${token.tokenType} `;
        }
        return result;
    }

    // Model printing

    public printConstant = printConstant;
    public printAccept = printAccept;
    public printAppendStatement = printAppendStatement;
    public printApplication = printApplication;
    public printCaptureStatement = printCaptureStatement;
    public printClearStatement = printClearStatement;
    public printConfigField = printConfigField;
    public printConfig = printConfig;
    public printConnectionEgress = printConnectionEgress;
    public printConnectionIngress = printConnectionIngress;
    public printConnection = printConnection;
    public printElseifStatement = printElseifStatement;
    public printElseStatement = printElseStatement;
    public printEmitStatement = printEmitStatement;
    public printEnum = printEnum;
    public printEnumValue = printEnumValue;
    public printExpectStatement = printExpectStatement;
    public printForStatement = printForStatement;
    public printIfStatement = printIfStatement;
    public printMessageDestination = printMessageDestination;
    public printMessageFieldDefinition = printMessageFieldDefinition;
    public printMessageType = printMessageType;
    public printNamespace = printNamespace;
    public printNetworkEgress = printNetworkEgress;
    public printNetworkIngress = printNetworkIngress;
    public printNetwork = printNetwork;
    public printPipe = printPipe;
    public printPipeRoute = printPipeRoute;
    public printPrependStatement = printPrependStatement;
    public printProcess = printProcess;
    public printRemoveStatement = printRemoveStatement;
    public printRouteStatement = printRouteStatement;
    public printSetStatement = printSetStatement;
    public printSourceFile = printSourceFile;
    public printTest = printTest;
    public printStatement = printStatement;
    public printUsing = printUsing;
    public printVarStatement = printVarStatement;
    public printWhileStatement = printWhileStatement;
}
