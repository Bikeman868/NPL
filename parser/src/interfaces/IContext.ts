import { IParsable } from '#interfaces/IParsable.js';
import { Position } from '#interfaces/Position.js';
import { SyntaxError } from '#interfaces/SyntaxError.js';
import { SyntaxGraph } from '#interfaces/SyntaxGraph.js';

/**
 * The parser is completely stateless. All parsing state is contained
 * in this IContext instance which must be passed to any parsing operations
 */
export interface IContext {
    readonly buffer: IParsable;
    readonly position: Position;
    readonly syntaxErrors: SyntaxError[];
    readonly isDryRun: boolean;
    readonly pathLength: number;
    readonly pathDescription: string;
    readonly syntaxGraph: SyntaxGraph;

    pushPath(name: string | undefined): void;
    popPath(): string | undefined;
    getPathElement(index: number): string;
    clearPath(): void;

    debugLogging: (context: IContext) => boolean;
    traceLogging: (context: IContext) => boolean;

    capturePosition(): void;
    restorePosition(): void;

    syntaxError(message: string): void;
    getDebugIndent(): string;
    debug(messageFunc: () => any, indent?: string): void;
    trace(messageFunc: () => any, indent?: string): void;
}
