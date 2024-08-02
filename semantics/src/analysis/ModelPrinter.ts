import { AcceptModel } from '#model/AcceptModel.js';
import { AcceptStatementModel } from '#model/AcceptStatementModel.js';
import { ApplicationModel } from '#model/ApplicationModel.js';
import { ConfigModel } from '#model/ConfigModel.js';
import { ConnectionEgressModel } from '#model/ConnectionEgressModel.js';
import { ConnectionIngressModel } from '#model/ConnectionIngressModel.js';
import { ConnectionModel } from '#model/ConnectionModel.js';
import { ConstModel } from '#model/ConstModel.js';
import { EnumModel } from '#model/EnumModel.js';
import { MessageTypeModel } from '#model/MessageTypeModel.js';
import { NamespaceModel } from '#model/NamespaceModel.js';
import { NetworkEgressModel } from '#model/NetworkEgressModel.js';
import { NetworkIngressModel } from '#model/NetworkIngressModel.js';
import { NetworkModel } from '#model/NetworkModel.js';
import { PipeModel } from '#model/PipeModel.js';
import { PipeRouteModel } from '#model/PipeRouteModel.js';
import { ProcessModel } from '#model/ProcessModel.js';
import { RoutingStatementModel } from '#model/RoutingStatementModel.js';
import { SourceFileModel } from '#model/SourceFileModel.js';
import { TestModel } from '#model/TestModel.js';
import { TestStatementModel } from '#model/TestStatementModel.js';
import { UsingModel } from '#model/UsingModel.js';
import { IToken, TokenType } from 'npl-syntax';

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

    protected printComments(model: { comments: string[] }, indent: number, alwaysPrintBlankLine: boolean = false): boolean {
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
        ]
        
        let result = '';
        for (const token of expression) {
            if (token.tokenType in typesToPrintText)
                result += `${token.tokenType} (${token.text}) `;
            else result += `${token.tokenType} `;
        }
        return result;
    }

    // Model printing

    public printConstant = printConstant;
    public printAccept = printAccept;
    public printAcceptStatement = printAcceptStatement;
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
    public printRoutingStatement = printRoutingStatement;
    public printSetStatement = printSetStatement;
    public printSourceFile = printSourceFile;
    public printTest = printTest;
    public printTestStatement = printTestStatement;
    public printUsing = printUsing;
    public printVarStatement = printVarStatement;
    public printWhileStatement = printWhileStatement;
}

function printAppendStatement(this: ModelPrinter, model: NamespaceModel, indent: number){}
function printCaptureStatement(this: ModelPrinter, model: NamespaceModel, indent: number){}
function printClearStatement(this: ModelPrinter, model: NamespaceModel, indent: number){}
function printConfigField(this: ModelPrinter, model: NamespaceModel, indent: number){}
function printElseifStatement(this: ModelPrinter, model: NamespaceModel, indent: number){}
function printElseStatement(this: ModelPrinter, model: NamespaceModel, indent: number){}
function printEmitStatement(this: ModelPrinter, model: NamespaceModel, indent: number){}
function printEnumValue(this: ModelPrinter, model: NamespaceModel, indent: number){}
function printExpectStatement(this: ModelPrinter, model: NamespaceModel, indent: number){}
function printForStatement(this: ModelPrinter, model: NamespaceModel, indent: number){}
function printIfStatement(this: ModelPrinter, model: NamespaceModel, indent: number){}
function printMessageDestination(this: ModelPrinter, model: NamespaceModel, indent: number){}
function printMessageFieldDefinition(this: ModelPrinter, model: NamespaceModel, indent: number){}
function printPrependStatement(this: ModelPrinter, model: NamespaceModel, indent: number){}
function printRemoveStatement(this: ModelPrinter, model: NamespaceModel, indent: number){}
function printRouteStatement(this: ModelPrinter, model: NamespaceModel, indent: number){}
function printSetStatement(this: ModelPrinter, model: NamespaceModel, indent: number){}
function printVarStatement(this: ModelPrinter, model: NamespaceModel, indent: number){}
function printWhileStatement(this: ModelPrinter, model: NamespaceModel, indent: number){}

function printNamespace(this: ModelPrinter, model: NamespaceModel, indent: number) {
        this.printComments(model, indent, true);
        this.printLine(`namespace ${model.identifier} {`, indent);
        for (const using of model.usings) this.printUsing(using, indent + 1);
        for (const constant of model.constants) this.printConstant(constant, indent + 1);
        for (const application of model.applications) this.printApplication(application, indent + 1);
        for (const messageType of model.messageTypes) this.printMessageType(messageType, indent + 1);
        for (const network of model.networks) this.printNetwork(network, indent + 1);
        for (const enumeration of model.enums) this.printEnum(enumeration, indent + 1);
        this.printLine('}', indent);
    }

    function printSourceFile(this: ModelPrinter, model: SourceFileModel, indent: number) {
        for (const using of model.usings) this.printUsing(using, indent);
        for (const namespace of model.namespaces) this.printNamespace(namespace, indent);
    }

    function printUsing(this: ModelPrinter, model: UsingModel, indent: number) {
        this.printComments(model, indent);
        this.printLine(`using ${model.namespace}`, indent);
    }

    function printApplication(this: ModelPrinter, model: ApplicationModel, indent: number) {
        this.printComments(model, indent, true);
        this.printLine(`application ${model.identifier} {`, indent);
        for (const config of model.configs) this.printConfig(config, indent + 1);
        for (const connection of model.connections) this.printConnection(connection, indent + 1);
        this.printLine('}', indent);
    }

    function printConfig(this: ModelPrinter, model: ConfigModel, indent: number) {
        this.printComments(model, indent);
        this.printLine(`config {`, indent);
        for (const field of model.fields) {
            let expression = '';
            for (const token of field.expression) expression += token.tokenType + '(' + token.text + ') ';
            this.printComments(field, indent + 1, false);
            this.printLine(`${field.fieldName} ${expression}`, indent + 1);
        }
        this.printLine('}', indent);
    }

    function printConnection(this: ModelPrinter, model: ConnectionModel, indent: number) {
        this.printComments(model, indent);
        this.printLine(`connection ${model.typeIdentifier} ${model.identifier} {`, indent);
        for (const config of model.configs) this.printConfig(config, indent + 1);
        for (const ingress of model.ingresses) this.printConnectionIngress(ingress, indent + 1);
        for (const egress of model.egresses) this.printConnectionEgress(egress, indent + 1);
        this.printLine('}', indent);
    }

    function printConnectionIngress(this: ModelPrinter, model: ConnectionIngressModel, indent: number) {
        this.printComments(model, indent);
        if (model.networkEndpoints.length == 1) {
            this.printLine(`ingress ${model.messageType} ${model.networkEndpoints[0]}`, indent);
        } else {
            this.printLine(`ingress ${model.messageType} {`, indent);
            for (const endpoint of model.networkEndpoints) {
                this.printLine(endpoint, indent + 1);
            }
            this.printLine('}', indent);
        }
    }

    function printConnectionEgress(this: ModelPrinter, model: ConnectionEgressModel, indent: number) {
        this.printComments(model, indent);
        if (model.networkEndpoints.length == 1) {
            this.printLine(`egress ${model.messageType} ${model.networkEndpoints[0]}`, indent);
        } else {
            this.printLine(`egress ${model.messageType} {`, indent);
            for (const endpoint of model.networkEndpoints) {
                this.printLine(endpoint, indent + 1);
            }
            this.printLine('}', indent);
        }
    }

    function printMessageType(this: ModelPrinter, model: MessageTypeModel, indent: number) {
        this.printComments(model, indent, true);
        if (model.fields.length == 1 && model.fields[0].comments.length == 0) {
            const field = model.fields[0];
            const fieldType = field.type.map((t) => t.text).join('');
            if (field.lifecycle == 'current')
                this.printLine(`message ${model.identifier} ${fieldType} ${field.identifier}`, indent);
            else
                this.printLine(
                    `message ${model.identifier} ${field.lifecycle} ${fieldType} ${field.identifier}`,
                    indent,
                );
        } else {
            this.printLine(`message ${model.identifier} {`, indent);
            for (const field of model.fields) {
                const fieldType = field.type.map((t) => t.text).join('');
                this.printComments(field, indent + 1, false);
                if (field.lifecycle == 'current') this.printLine(`${fieldType} ${field.identifier}`, indent + 1);
                else this.printLine(`${field.lifecycle} ${fieldType} ${field.identifier}`, indent + 1);
            }
            this.printLine('}', indent);
        }
    }

    function printNetwork(this: ModelPrinter, model: NetworkModel, indent: number) {
        this.printComments(model, indent, true);
        this.printLine(`network ${model.identifier} {`, indent);
        for (const config of model.configs) this.printConfig(config, indent + 1);
        for (const ingress of model.ingresses) this.printNetworkIngress(ingress, indent + 1);
        for (const egress of model.egresses) this.printNetworkEgress(egress, indent + 1);
        for (const constant of model.constants) this.printConstant(constant, indent + 1);
        for (const messageType of model.messageTypes) this.printMessageType(messageType, indent + 1);
        for (const pipe of model.pipes) this.printPipe(pipe, indent + 1);
        for (const process of model.processes) this.printProcess(process, indent + 1);
        for (const enumeration of model.enums) this.printEnum(enumeration, indent + 1);
        this.printLine('}', indent);
    }

    function printNetworkIngress(this: ModelPrinter, model: NetworkIngressModel, indent: number) {
        this.printComments(model, indent, false);
        if (model.destinations.length == 0) {
            this.printLine(`ingress ${model.endpointName}`, indent);
        } else if (model.destinations.length == 1) {
            const destination = model.destinations[0];
            this.printLine(`ingress ${model.endpointName} ${destination.kind} ${destination.identifier}`, indent);
        } else {
            this.printLine(`ingress ${model.endpointName} {`, indent);
            for (const destination of model.destinations)
                this.printLine(`${destination.kind} ${destination.identifier}`, indent + 1);
            this.printLine('}', indent);
        }
    }

    function printNetworkEgress(this: ModelPrinter, model: NetworkEgressModel, indent: number) {
        this.printComments(model, indent, false);
        if (model.messageTypes.length == 0) {
            this.printLine(`egress ${model.endpointName}`, indent);
        } else if (model.messageTypes.length == 1) {
            this.printLine(`egress ${model.endpointName} ${model.messageTypes[0]}`, indent);
        } else {
            this.printLine(`egress ${model.endpointName} {`, indent);
            for (const messageType of model.messageTypes) this.printLine(messageType, indent + 1);
            this.printLine('}', indent);
        }
    }

    function printPipe(this: ModelPrinter, model: PipeModel, indent: number) {
        this.printComments(model, indent, true);
        this.printLine(`pipe ${model.identifier} {`, indent);
        for (const config of model.configs) this.printConfig(config, indent + 1);
        for (const constant of model.constants) this.printConstant(constant, indent + 1);
        for (const enumeration of model.enums) this.printEnum(enumeration, indent + 1);
        for (const route of model.routes) this.printPipeRoute(route, indent + 1);
        this.printLine('}', indent);
    }

    function printProcess(this: ModelPrinter, model: ProcessModel, indent: number) {
        this.printComments(model, indent, true);
        this.printLine(`process ${model.identifier} {`, indent);
        for (const config of model.configs) this.printConfig(config, indent + 1);
        for (const constant of model.constants) this.printConstant(constant, indent + 1);
        for (const messageType of model.messageTypes) this.printMessageType(messageType, indent + 1);
        for (const enumeration of model.enums) this.printEnum(enumeration, indent + 1);
        for (const accept of model.accepts) this.printAccept(accept, indent + 1);
        for (const test of model.tests) this.printTest(test, indent + 1);
        this.printLine('}', indent);
    }

    function printEnum(this: ModelPrinter, model: EnumModel, indent: number) {
        this.printComments(model, indent, true);
        if (model.values.length < 6 && model.values.reduce((sum, value) => sum + value.comments.length, 0) == 0) {
            const values = model.values.reduce((text, value) => text + ' ' + value.identifier, '');
            this.printLine(`enum ${model.identifier}${values}`, indent);
        } else {
            this.printLine(`enum ${model.identifier} {`, indent);
            let priorHasComments = false;
            for (const value of model.values) {
                if (priorHasComments) this.printBlankLine();
                priorHasComments = this.printComments(value, indent + 1, false);
                this.printLine(`${value.identifier}`, indent + 1);
            }
            this.printLine('}', indent);
        }
    }

    function printAccept(this: ModelPrinter, model: AcceptModel, indent: number) {}

    function printTest(this: ModelPrinter, model: TestModel, indent: number) {}

    function printAcceptStatement(this: ModelPrinter, model: AcceptStatementModel, indent: number) {}

    function printPipeRoute(this: ModelPrinter, model: PipeRouteModel, indent: number) {}

    function printRoutingStatement(this: ModelPrinter, model: RoutingStatementModel, indent: number) {}

    function printTestStatement(this: ModelPrinter, model: TestStatementModel, indent: number) {}



function printConstant(this: ModelPrinter, model: ConstModel, indent: number) {
    this.printComments(model, indent, false);
    this.printLine(`const ${model.identifier} ${this.formatExpression(model.expression)}`, indent);
}

