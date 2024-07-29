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
    private printLine(line: string, indent: number): void {
        console.log('  '.repeat(indent) + line);
    }

    private printBlankLine() {
        console.log();
    }

    printComment(comment: string, indent: number) {
        if (comment.indexOf('\n') >= 0) {
            this.printLine('/*', indent);
            for (const line of comment.split('\n')) this.printLine(line.trim(), indent + 1);
            this.printLine('*/', indent);
        } else {
            this.printLine(`// ${comment}`, indent);
        }
    }

    printComments(model: { comments: string[] }, indent: number, alwaysPrintBlankLine: boolean = false): boolean {
        if (!model || !model.comments.length) {
            if (alwaysPrintBlankLine) this.printBlankLine();
            return false;
        }

        this.printBlankLine();

        for (const comment of model.comments) this.printComment(comment, indent);

        return true;
    }

    printLineBreakIfComments(model: { comments: string[] }): void {
        if (model.comments.length) this.printBlankLine();
    }

    private readonly expressionTokenTypesToPrintText: TokenType[] = [
        'StringLiteral',
        'Identifier',
        'QualifiedIdentifier',
        'BooleanLiteral',
        'Keyword',
        'Type',
        'StartMessageLiteral',
    ];

    private formatExpression(expression: IToken[]): string {
        let result = '';
        for (const token of expression) {
            if (token.tokenType in this.expressionTokenTypesToPrintText)
                result += `${token.tokenType} (${token.text}) `;
            else
                result += `${token.tokenType} `;
        }
        return result;
    }

    printConstant(model: ConstModel, indent: number) {
        this.printComments(model, indent, false);
        this.printLine(`const ${model.identifier} ${this.formatExpression(model.expression)}`, indent);
    }

    printNamespace(model: NamespaceModel, indent: number) {
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

    printSourceFile(model: SourceFileModel, indent: number) {
        for (const using of model.usings) this.printUsing(using, indent);
        for (const namespace of model.namespaces) this.printNamespace(namespace, indent);
    }

    printUsing(model: UsingModel, indent: number) {
        this.printComments(model, indent);
        this.printLine(`using ${model.namespace}`, indent);
    }

    printApplication(model: ApplicationModel, indent: number) {
        this.printComments(model, indent, true);
        this.printLine(`application ${model.identifier} {`, indent);
        for (const config of model.configs) this.printConfig(config, indent + 1);
        for (const connection of model.connections) this.printConnection(connection, indent + 1);
        this.printLine('}', indent);
    }

    printConfig(model: ConfigModel, indent: number) {
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

    printConnection(model: ConnectionModel, indent: number) {
        this.printComments(model, indent);
        this.printLine(`connection ${model.typeIdentifier} ${model.identifier} {`, indent);
        for (const config of model.configs) this.printConfig(config, indent + 1);
        for (const ingress of model.ingresses) this.printConnectionIngress(ingress, indent + 1);
        for (const egress of model.egresses) this.printConnectionEgress(egress, indent + 1);
        this.printLine('}', indent);
    }

    printConnectionIngress(model: ConnectionIngressModel, indent: number) {
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

    printConnectionEgress(model: ConnectionEgressModel, indent: number) {
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

    printMessageType(model: MessageTypeModel, indent: number) {
        this.printComments(model, indent, true);
        if (model.fields.length == 1 && model.fields[0].comments.length == 0) {
            const field = model.fields[0];
            const fieldType = field.type.map(t => t.text).join('');
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
                const fieldType = field.type.map(t => t.text).join('');
                this.printComments(field, indent + 1, false);
                if (field.lifecycle == 'current') this.printLine(`${fieldType} ${field.identifier}`, indent + 1);
                else this.printLine(`${field.lifecycle} ${fieldType} ${field.identifier}`, indent + 1);
            }
            this.printLine('}', indent);
        }
    }

    printNetwork(model: NetworkModel, indent: number) {
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

    printNetworkIngress(model: NetworkIngressModel, indent: number) {
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

    printNetworkEgress(model: NetworkEgressModel, indent: number) {
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

    printPipe(model: PipeModel, indent: number) {
        this.printComments(model, indent, true);
        this.printLine(`pipe ${model.identifier} {`, indent);
        for (const config of model.configs) this.printConfig(config, indent + 1);
        for (const constant of model.constants) this.printConstant(constant, indent + 1);
        for (const enumeration of model.enums) this.printEnum(enumeration, indent + 1);
        for (const route of model.routes) this.printPipeRoute(route, indent + 1);
        this.printLine('}', indent);
    }

    printProcess(model: ProcessModel, indent: number) {
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

    printEnum(model: EnumModel, indent: number) {
        this.printComments(model, indent, true);
        if (model.values.length < 6 && model.values.reduce((sum, value) => sum + value.comments.length, 0) == 0) {
            const values = model.values.reduce((text, value) => text + ' ' + value.identifier, '')
            this.printLine(`enum ${model.identifier}${values}`, indent);
        } else {
            this.printLine(`enum ${model.identifier} {`, indent);
            let priorHasComments = false;
            for (const value of model.values) {
                if (priorHasComments) this.printBlankLine();
                priorHasComments = this.printComments(value, indent + 1, false);
                this.printLine(`${value.identifier}`, indent + 1)
            }
            this.printLine('}', indent);
        }
    }

    printAccept(model: AcceptModel, indent: number) {
        
    }

    printTest(model: TestModel, indent: number) {
        
    }

    printAcceptStatement(model: AcceptStatementModel, indent: number) {

    }

    printPipeRoute(model: PipeRouteModel, indent: number) {
        
    }

    printRoutingStatement(model: RoutingStatementModel, indent: number) {

    }

    printTestStatement(model: TestStatementModel, indent: number) {

    }
}
