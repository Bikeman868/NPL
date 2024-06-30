import { IParsable } from '#interfaces/IParsable.js';
import { Position } from '#interfaces/Position.js';
import { IContext } from '#interfaces/IContext.js';
import { SyntaxError } from '#interfaces/SyntaxError.js';
import { SyntaxGraph } from '#interfaces/SyntaxGraph.js';

export class Context implements IContext {
    private _buffer: IParsable;
    private _position: Position;
    private _syntaxErrors: SyntaxError[];
    private _isDryRun: boolean;
    private _debugOutput: (line: String) => void;
    private _statePath: string[] = [];
    private _syntaxGraph: SyntaxGraph;

    debugLogging: (context: IContext) => boolean = () => false;
    traceLogging: (context: IContext) => boolean = () => false;

    constructor(buffer: IParsable, syntaxGraph: SyntaxGraph, isDryRun?: boolean, debugOutput?: (line: String) => void) {
        this._buffer = buffer;
        this._syntaxGraph = syntaxGraph;
        this._isDryRun = !!isDryRun;
        this._position = buffer.getPosition();
        this._syntaxErrors = [];
        this._debugOutput = debugOutput || ((line: String) => console.log(line));
    }

    get buffer() {
        return this._buffer;
    }

    get syntaxGraph() {
        return this._syntaxGraph;
    }

    get isDryRun() {
        return this._isDryRun;
    }

    set isDryRun(enabled: boolean) {
        this._isDryRun = enabled;
    }

    get position(): Position {
        return this._position;
    }

    get syntaxErrors(): SyntaxError[] {
        return this._syntaxErrors;
    }

    get pathLength(): number {
        return this._statePath.length;
    }

    get pathDescription(): string {
        return 'npl.' + this._statePath.join('.');
    }

    pushPath(name: string | undefined): void {
        if (name) this._statePath.push(name);
    }

    popPath(): string | undefined {
        return this._statePath.pop();
    }

    getPathElement(index: number): string {
        const name = this._statePath[index];
        if (!name) throw Error(`Access to path element ${index} when path length is ${this._statePath.length}`);
        return name;
    }

    clearPath(): void {
        this._statePath = [];
    }

    capturePosition() {
        this._position = this._buffer.getPosition();
    }

    restorePosition() {
        this._buffer.setPosition(this._position);
    }

    syntaxError(message: string): void {
        const state = 'npl.' + this._statePath.join('.');

        this._syntaxErrors.push({
            state,
            message,
            ...this._position,
        });

        this.debug(() => {
            const bufferText = this._buffer.getRaw(this._position, 40).replace(/(?:\r\n|\r|\n)/g, '\\n');
            return `Syntax error in ${state}. ${message} in "${bufferText}"`;
        });
    }

    debug(messageFunc: () => any, indent?: string): void {
        if (this.debugLogging(this) || this.traceLogging(this)) {
            const message = messageFunc();
            if (!message) return;

            if (indent == undefined) indent = this.getDebugIndent();

            const position = this.buffer.getPosition();
            const lineNumber = ('000' + position.line).slice(-4);
            const columnNumber = ('00' + position.column).slice(-3);
            this._debugOutput(
                lineNumber + ' ' + columnNumber + ' ' + indent + message + ' [' + this.pathDescription + ']',
            );
        }
    }

    trace(messageFunc: () => any, indent?: string): void {
        if (this.traceLogging(this)) {
            const message = messageFunc();
            if (!message) return;

            if (indent == undefined) indent = this.getTraceIndent();

            const position = this.buffer.getPosition();
            const lineNumber = ('000' + position.line).slice(-4);
            const columnNumber = ('00' + position.column).slice(-3);

            this._debugOutput(lineNumber + ' ' + columnNumber + ' ' + indent + message);
        }
    }

    getDebugIndent(): string {
        let indent = '';

        if (this.debugLogging(this)) {
            this._statePath.forEach(() => {
                indent += '  ';
            });
        }

        return indent;
    }

    getTraceIndent(): string {
        return this.getDebugIndent() + ' - ';
    }
}
