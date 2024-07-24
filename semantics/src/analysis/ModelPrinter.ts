import { NamespaceModel } from "#model/NamespaceModel.js";
import { SourceFileModel } from "#model/SourceFileModel.js";
import { UsingModel } from "#model/UsingModel.js";

export class ModelPrinter {
    private printLine(line: string, indent: number): void {
        console.log('  '.repeat(indent) + line)
    }

    private printBlankLine() {
        console.log();
    }

    printSourceFile(sourceFile: SourceFileModel, indent: number) {
        for (const using of sourceFile.usings) this.printUsing(using, indent);
        for (const namespace of sourceFile.namespaces) this.printNamespace(namespace, indent);
    }

    printNamespace(namespace: NamespaceModel, indent: number) {
        this.printComments(namespace.comments, indent, true)
        this.printLine(`namespace ${namespace.identifier} {`, indent);
        for (const using of namespace.usings)
            this.printUsing(using, indent + 1);
        this.printLine('}', indent);
    }

    printUsing(using: UsingModel, indent: number) {
        this.printComments(using.comments, indent);
        this.printLine(`using ${using.namespace}`, indent);
    }

    printComment(comment: string, indent: number) {
        this.printLine(`// ${comment}`, indent)
    }

    printComments(comments: string[], indent: number, alwaysPrintBlankLine: boolean = false): boolean {
        if (!comments.length) {
            if (alwaysPrintBlankLine)
                this.printBlankLine();
            return false;
        }

        this.printBlankLine();
        
        for (const comment of comments)
            this.printComment(comment, indent);
        
        return true;
    }
}